import { isDueForCleaning, washesSinceCleaning } from './entry.domain'
import type { EntryItem, EntryKind, MachineDetails, MachineListItem } from './machine.model'
import prisma from './prisma'

export type { EntryItem, EntryKind, MachineDetails, MachineListItem }
export { washesSinceCleaning }
export {
  isEntryKind,
  MachineInputError,
  validateCleaningInterval,
  validateEntryInput,
  validateMachineName,
} from './machine.model'

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
