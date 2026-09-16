import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { createLocalStorageMachineStore, type StorageLike } from '../lib/store/local-storage-store'
import { runMachineStoreContract } from './machine-store.contract'

// An in-memory stand-in for `window.localStorage`.
function createFakeStorage(): StorageLike & { keys(): string[] } {
  const items = new Map<string, string>()
  return {
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => {
      items.set(key, String(value))
    },
    keys: () => [...items.keys()],
  }
}

const originalFetch = globalThis.fetch

// The demo makes no API calls, so any call to `fetch` fails the test.
beforeAll(() => {
  globalThis.fetch = (() => {
    throw new Error('The localStorage store must not call fetch')
  }) as typeof fetch
})

afterAll(() => {
  globalThis.fetch = originalFetch
})

runMachineStoreContract(() => createLocalStorageMachineStore(createFakeStorage()))

describe('demo data', () => {
  test('fills an empty store with sample machines and entries on first use', async () => {
    const store = createLocalStorageMachineStore(createFakeStorage())
    const machines = await store.listMachines()
    expect(machines.length).toBeGreaterThan(0)

    const details = await store.getMachine(machines[0].id)
    expect(details?.entries.length).toBeGreaterThan(0)
  })

  test('the sample data shows a machine that is due for cleaning', async () => {
    const store = createLocalStorageMachineStore(createFakeStorage())
    const machines = await store.listMachines()
    expect(machines.some((machine) => machine.dueForCleaning)).toBe(true)
  })

  test('keeps the data under one key in the browser storage', async () => {
    const storage = createFakeStorage()
    const store = createLocalStorageMachineStore(storage)
    const machine = await store.createMachine('One key')
    await store.logEntry(machine.id, 'wash')
    expect(storage.keys()).toHaveLength(1)
  })

  test('keeps changes for a later visit in the same browser', async () => {
    const storage = createFakeStorage()
    const machine = await createLocalStorageMachineStore(storage).createMachine('Remembered')

    const laterVisit = createLocalStorageMachineStore(storage)
    const details = await laterVisit.getMachine(machine.id)
    expect(details?.name).toBe('Remembered')
  })

  test('starts again with sample data when the stored value cannot be read', async () => {
    const storage = createFakeStorage()
    const store = createLocalStorageMachineStore(storage)
    const sample = await store.listMachines()

    for (const key of storage.keys()) {
      storage.setItem(key, '{not json')
    }

    expect((await store.listMachines()).map((machine) => machine.name)).toEqual(sample.map((machine) => machine.name))
  })

  test('reset puts back the sample data', async () => {
    const store = createLocalStorageMachineStore(createFakeStorage())
    const sample = await store.listMachines()

    const added = await store.createMachine('Added by a visitor')
    await store.deleteMachine(sample[0].id)
    await store.logEntry(sample[1].id, 'cleaning')

    store.reset()

    const machines = await store.listMachines()
    expect(machines.map((machine) => machine.name)).toEqual(sample.map((machine) => machine.name))
    expect(machines.map((machine) => machine.washesSinceCleaning)).toEqual(sample.map((machine) => machine.washesSinceCleaning))
    expect(await store.getMachine(added.id)).toBeNull()
  })
})
