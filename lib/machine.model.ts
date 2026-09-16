// The machine and entry shapes and their input checks. This module has no database import, so the
// server and the localStorage store of the demo share it, and the marketing site never loads Prisma.

export type EntryKind = 'wash' | 'cleaning'

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
