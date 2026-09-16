import type { EntryItem, EntryKind, MachineDetails, MachineListItem } from '../machine.service'

export type { EntryItem, EntryKind, MachineDetails, MachineListItem }
export { MachineInputError } from '../machine.service'

// The seam between the tracker screens and their data. Every tracker screen calls this
// interface through a React context, never `fetch` or localStorage directly.
export interface MachineStore {
  listMachines(): Promise<MachineListItem[]>
  getMachine(machineId: number): Promise<MachineDetails | null>
  createMachine(name: string): Promise<MachineListItem>
  renameMachine(machineId: number, name: string): Promise<MachineListItem>
  // `null` clears the cleaning interval.
  setCleaningInterval(machineId: number, cleaningInterval: number | null): Promise<MachineListItem>
  deleteMachine(machineId: number): Promise<void>
  // occurredAt is an ISO 8601 string. Uses the current time when it is not given.
  logEntry(machineId: number, kind: EntryKind, occurredAt?: string): Promise<EntryItem>
  deleteEntry(machineId: number, entryId: number): Promise<void>
}
