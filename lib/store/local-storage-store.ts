import { isDueForCleaning, washesSinceCleaning } from '../entry.domain'
import { validateCleaningInterval, validateEntryInput, validateMachineName } from '../machine.model'
import type { EntryItem, EntryKind, MachineDetails, MachineListItem, MachineStore } from './types'

// The one localStorage key of the demo. Change the version when the stored shape changes, so an
// old value is replaced with fresh sample data instead of being misread.
export const DEMO_STORAGE_KEY = 'wash-cycle-tracker-demo:v1'

const STATE_VERSION = 1
const DAY = 24 * 60 * 60 * 1000

// The part of the Web Storage API that the store needs. Tests pass a fake.
export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

interface StoredMachine {
  id: number
  name: string
  cleaningInterval: number | null
  entries: EntryItem[]
}

interface DemoState {
  version: typeof STATE_VERSION
  nextMachineId: number
  nextEntryId: number
  // In creation order.
  machines: StoredMachine[]
}

// A `MachineStore` that keeps the demo data in the browser. `reset` puts back the sample data.
export interface DemoMachineStore extends MachineStore {
  reset(): void
}

// Builds the sample machines and entries, with times relative to `now` so the demo looks current.
export function buildSampleState(now: Date = new Date()): DemoState {
  let nextEntryId = 1
  const entry = (kind: EntryKind, daysAgo: number, hour: number): EntryItem => {
    const day = new Date(now.getTime() - daysAgo * DAY)
    day.setHours(hour, 0, 0, 0)
    return { id: nextEntryId++, kind, occurredAt: day.toISOString() }
  }

  const home: StoredMachine = {
    id: 1,
    name: 'Home',
    cleaningInterval: 5,
    entries: [
      entry('wash', 40, 9),
      entry('wash', 36, 18),
      entry('cleaning', 30, 10),
      entry('wash', 25, 8),
      entry('wash', 19, 19),
      entry('wash', 12, 7),
      entry('wash', 6, 20),
      entry('wash', 1, 9),
    ],
  }
  const holidayFlat: StoredMachine = {
    id: 2,
    name: 'Holiday flat',
    cleaningInterval: 10,
    entries: [entry('cleaning', 60, 11), entry('wash', 45, 15), entry('wash', 8, 16)],
  }
  const basement: StoredMachine = {
    id: 3,
    name: 'Basement',
    cleaningInterval: null,
    entries: [entry('wash', 20, 14), entry('wash', 3, 17)],
  }

  const machines = [home, holidayFlat, basement].map((machine) => ({ ...machine, entries: sortNewestFirst(machine.entries) }))
  return { version: STATE_VERSION, nextMachineId: 4, nextEntryId, machines }
}

function sortNewestFirst(entries: EntryItem[]): EntryItem[] {
  return [...entries].sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt))
}

function isDemoState(value: unknown): value is DemoState {
  const state = value as DemoState | null
  return (
    typeof state === 'object' &&
    state !== null &&
    state.version === STATE_VERSION &&
    Number.isInteger(state.nextMachineId) &&
    Number.isInteger(state.nextEntryId) &&
    Array.isArray(state.machines)
  )
}

// Uses the same pure domain functions as the server.
function toListItem(machine: StoredMachine): MachineListItem {
  const washes = washesSinceCleaning(machine.entries)
  return {
    id: machine.id,
    name: machine.name,
    cleaningInterval: machine.cleaningInterval,
    washesSinceCleaning: washes,
    dueForCleaning: isDueForCleaning(washes, machine.cleaningInterval),
    latestEntryAt: machine.entries[0]?.occurredAt ?? null,
  }
}

function notFound(what: 'Machine' | 'Entry'): Error {
  return new Error(`${what} not found`)
}

// Creates the demo store. Without a `storage`, it uses `window.localStorage` at call time, so the
// module is safe to import during server rendering.
export function createLocalStorageMachineStore(storage?: StorageLike): DemoMachineStore {
  const getStorage = (): StorageLike => storage ?? globalThis.localStorage

  function save(state: DemoState): void {
    getStorage().setItem(DEMO_STORAGE_KEY, JSON.stringify(state))
  }

  // Reads the state. Fills the store with sample data on first use, or when the stored value is
  // missing, unreadable or from another version.
  function load(): DemoState {
    const raw = getStorage().getItem(DEMO_STORAGE_KEY)
    if (raw !== null) {
      try {
        const parsed: unknown = JSON.parse(raw)
        if (isDemoState(parsed)) {
          return parsed
        }
      } catch {
        // Falls through to the sample data.
      }
    }
    const sample = buildSampleState()
    save(sample)
    return sample
  }

  // Loads the state, applies `change` and saves the result.
  function update<T>(change: (state: DemoState) => T): T {
    const state = load()
    const result = change(state)
    save(state)
    return result
  }

  function findMachine(state: DemoState, machineId: number): StoredMachine {
    const machine = state.machines.find((candidate) => candidate.id === machineId)
    if (!machine) {
      throw notFound('Machine')
    }
    return machine
  }

  // Runs synchronously, but returns a promise like every other store.
  const run = <T>(operation: () => T): Promise<T> => {
    try {
      return Promise.resolve(operation())
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    listMachines() {
      return run(() => load().machines.map(toListItem))
    },
    getMachine(machineId) {
      return run((): MachineDetails | null => {
        const machine = load().machines.find((candidate) => candidate.id === machineId)
        if (!machine) {
          return null
        }
        const summary = toListItem(machine)
        return {
          id: summary.id,
          name: summary.name,
          cleaningInterval: summary.cleaningInterval,
          washesSinceCleaning: summary.washesSinceCleaning,
          dueForCleaning: summary.dueForCleaning,
          entries: [...machine.entries],
        }
      })
    },
    createMachine(name) {
      return run(() => {
        const validName = validateMachineName({ name })
        return update((state) => {
          const machine: StoredMachine = { id: state.nextMachineId++, name: validName, cleaningInterval: null, entries: [] }
          state.machines.push(machine)
          return toListItem(machine)
        })
      })
    },
    renameMachine(machineId, name) {
      return run(() => {
        const validName = validateMachineName({ name })
        return update((state) => {
          const machine = findMachine(state, machineId)
          machine.name = validName
          return toListItem(machine)
        })
      })
    },
    setCleaningInterval(machineId, cleaningInterval) {
      return run(() => {
        const validInterval = validateCleaningInterval({ cleaningInterval })
        return update((state) => {
          const machine = findMachine(state, machineId)
          machine.cleaningInterval = validInterval
          return toListItem(machine)
        })
      })
    },
    deleteMachine(machineId) {
      return run(() =>
        update((state) => {
          const machine = findMachine(state, machineId)
          // The entries live inside the machine, so they go with it.
          state.machines = state.machines.filter((candidate) => candidate !== machine)
        })
      )
    },
    logEntry(machineId, kind, occurredAt) {
      return run(() => {
        const input = validateEntryInput(occurredAt === undefined ? { kind } : { kind, occurredAt })
        return update((state) => {
          const machine = findMachine(state, machineId)
          const entry: EntryItem = {
            id: state.nextEntryId++,
            kind: input.kind,
            occurredAt: (input.occurredAt ?? new Date()).toISOString(),
          }
          machine.entries = sortNewestFirst([entry, ...machine.entries])
          return entry
        })
      })
    },
    deleteEntry(machineId, entryId) {
      return run(() =>
        update((state) => {
          const machine = findMachine(state, machineId)
          if (!machine.entries.some((entry) => entry.id === entryId)) {
            throw notFound('Entry')
          }
          machine.entries = machine.entries.filter((entry) => entry.id !== entryId)
        })
      )
    },
    reset() {
      save(buildSampleState())
    },
  }
}
