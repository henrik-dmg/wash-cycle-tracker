import type { EntryKind } from './generated/prisma/client'
import prisma from './prisma'

export type { EntryKind }

export interface MachineListItem {
  id: number
  name: string
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

function toEntryItem(entry: { id: number; kind: EntryKind; occurredAt: Date }): EntryItem {
  return { id: entry.id, kind: entry.kind, occurredAt: entry.occurredAt.toISOString() }
}

export async function listMachines(): Promise<MachineListItem[]> {
  return prisma.machine.findMany({ select: { id: true, name: true }, orderBy: { createdAt: 'asc' } })
}

export async function getMachine(machineId: number): Promise<MachineDetails | null> {
  const machine = await prisma.machine.findUnique({
    where: { id: machineId },
    include: { entries: { orderBy: { occurredAt: 'desc' } } },
  })
  if (!machine) {
    return null
  }
  return {
    id: machine.id,
    name: machine.name,
    cleaningInterval: machine.cleaningInterval,
    entries: machine.entries.map(toEntryItem),
  }
}

export async function createMachine(name: string): Promise<MachineListItem> {
  return prisma.machine.create({ data: { name }, select: { id: true, name: true } })
}

// Logs an entry at the current time. Returns null if the machine does not exist.
export async function logEntry(machineId: number, kind: EntryKind): Promise<EntryItem | null> {
  const machine = await prisma.machine.findUnique({ where: { id: machineId }, select: { id: true } })
  if (!machine) {
    return null
  }
  const entry = await prisma.entry.create({ data: { machineId, kind } })
  return toEntryItem(entry)
}

// Deletes an entry of the machine. Returns false if the entry does not exist.
export async function deleteEntry(machineId: number, entryId: number): Promise<boolean> {
  const { count } = await prisma.entry.deleteMany({ where: { id: entryId, machineId } })
  return count > 0
}
