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
  deleteMachine(machineId: number): Promise<void>
  logEntry(machineId: number, kind: EntryKind): Promise<EntryItem>
  deleteEntry(machineId: number, entryId: number): Promise<void>
}
