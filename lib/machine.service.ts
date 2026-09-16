import type { EntryKind } from './generated/prisma/client'
import { isDueForCleaning, washesSinceCleaning } from './entry.domain'
import prisma from './prisma'

export type { EntryKind }
export { washesSinceCleaning }

export interface MachineListItem {
  id: number
  name: string
  cleaningInterval: number | null
  washesSinceCleaning: number
  dueForCleaning: boolean
  // ISO 8601 UTC string. Null when the machine has no entry.
  latestEntryAt: string | null
}

export interface EntryItem {
  id: number
  kind: EntryKind
  // ISO 8601 UTC string.
  occurredAt: string
}

export interface MachineDetails {
  id: number
  name: string
  cleaningInterval: number | null
  washesSinceCleaning: number
  dueForCleaning: boolean
  // Newest first.
  entries: EntryItem[]
}

export class MachineInputError extends Error {}

// Checks and cleans the name of a machine. Throws a MachineInputError for a name that is not valid.
export function validateMachineName(body: unknown): string {
  const input = (body ?? {}) as Record<string, unknown>
  const name = typeof input.name === 'string' ? input.name.trim() : ''
  if (!name || name.length > 100) {
    throw new MachineInputError('The name must have 1 to 100 characters')
  }
  return name
}

export function isEntryKind(value: unknown): value is EntryKind {
  return value === 'wash' || value === 'cleaning'
}

// Checks and cleans the cleaning interval of a machine. `null` clears the interval. Throws a
// MachineInputError for anything else that is not a positive integer.
export function validateCleaningInterval(body: unknown): number | null {
  const input = (body ?? {}) as Record<string, unknown>
  if (input.cleaningInterval === null) {
    return null
  }
  const value = input.cleaningInterval
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    throw new MachineInputError('The cleaning interval must be a positive integer, or null to clear it')
  }
  return value
}

function toEntryItem(entry: { id: number; kind: EntryKind; occurredAt: Date }): EntryItem {
  return { id: entry.id, kind: entry.kind, occurredAt: entry.occurredAt.toISOString() }
}

function toMachineListItem(machine: {
  id: number
  name: string
  cleaningInterval: number | null
  entries: { id: number; kind: EntryKind; occurredAt: Date }[]
}): MachineListItem {
  const entries = machine.entries.map(toEntryItem)
  const washes = washesSinceCleaning(entries)
  return {
    id: machine.id,
    name: machine.name,
    cleaningInterval: machine.cleaningInterval,
    washesSinceCleaning: washes,
    dueForCleaning: isDueForCleaning(washes, machine.cleaningInterval),
    latestEntryAt: entries[0]?.occurredAt ?? null,
  }
}

// Checks and cleans the input to log an entry. Throws a MachineInputError for an invalid kind
// or an invalid occurred-at time.
export function validateEntryInput(body: unknown): { kind: EntryKind; occurredAt?: Date } {
  const input = (body ?? {}) as Record<string, unknown>
  if (!isEntryKind(input.kind)) {
    throw new MachineInputError('The kind must be "wash" or "cleaning"')
  }
  if (input.occurredAt === undefined) {
    return { kind: input.kind }
  }
  if (typeof input.occurredAt !== 'string') {
    throw new MachineInputError('The occurred-at time must be an ISO 8601 string')
  }
  const occurredAt = new Date(input.occurredAt)
  if (Number.isNaN(occurredAt.getTime())) {
    throw new MachineInputError('The occurred-at time must be a valid date and time')
  }
  return { kind: input.kind, occurredAt }
}

export async function listMachines(): Promise<MachineListItem[]> {
  const machines = await prisma.machine.findMany({
    orderBy: { createdAt: 'asc' },
    include: { entries: { orderBy: { occurredAt: 'desc' } } },
  })
  return machines.map(toMachineListItem)
}

export async function getMachine(machineId: number): Promise<MachineDetails | null> {
  const machine = await prisma.machine.findUnique({
    where: { id: machineId },
    include: { entries: { orderBy: { occurredAt: 'desc' } } },
  })
  if (!machine) {
    return null
  }
  const entries = machine.entries.map(toEntryItem)
  const washes = washesSinceCleaning(entries)
  return {
    id: machine.id,
    name: machine.name,
    cleaningInterval: machine.cleaningInterval,
    washesSinceCleaning: washes,
    dueForCleaning: isDueForCleaning(washes, machine.cleaningInterval),
    entries,
  }
}

export async function createMachine(name: string): Promise<MachineListItem> {
  const machine = await prisma.machine.create({
    data: { name },
    select: { id: true, name: true, cleaningInterval: true },
  })
  return {
    id: machine.id,
    name: machine.name,
    cleaningInterval: machine.cleaningInterval,
    washesSinceCleaning: 0,
    dueForCleaning: false,
    latestEntryAt: null,
  }
}

// Applies a partial update to a machine and returns its updated summary. Returns null if the
// machine does not exist.
async function updateMachineFields(
  machineId: number,
  data: { name?: string; cleaningInterval?: number | null }
): Promise<MachineListItem | null> {
  const { count } = await prisma.machine.updateMany({ where: { id: machineId }, data })
  if (count === 0) {
    return null
  }
  const machine = await prisma.machine.findUniqueOrThrow({
    where: { id: machineId },
    include: { entries: { orderBy: { occurredAt: 'desc' } } },
  })
  return toMachineListItem(machine)
}

// Renames a machine. Returns null if the machine does not exist.
export function renameMachine(machineId: number, name: string): Promise<MachineListItem | null> {
  return updateMachineFields(machineId, { name })
}

// Sets or clears the cleaning interval of a machine. Returns null if the machine does not exist.
export function setCleaningInterval(machineId: number, cleaningInterval: number | null): Promise<MachineListItem | null> {
  return updateMachineFields(machineId, { cleaningInterval })
}

// Deletes a machine and its entries. Returns false if the machine does not exist.
export async function deleteMachine(machineId: number): Promise<boolean> {
  const { count } = await prisma.machine.deleteMany({ where: { id: machineId } })
  return count > 0
}

// Logs an entry. Uses the current time when occurredAt is not given. Returns null if the
// machine does not exist.
export async function logEntry(machineId: number, kind: EntryKind, occurredAt?: Date): Promise<EntryItem | null> {
  const machine = await prisma.machine.findUnique({ where: { id: machineId }, select: { id: true } })
  if (!machine) {
    return null
  }
  const entry = await prisma.entry.create({ data: { machineId, kind, ...(occurredAt ? { occurredAt } : {}) } })
  return toEntryItem(entry)
}

// Deletes an entry of the machine. Returns false if the entry does not exist.
export async function deleteEntry(machineId: number, entryId: number): Promise<boolean> {
  const { count } = await prisma.entry.deleteMany({ where: { id: entryId, machineId } })
  return count > 0
}
