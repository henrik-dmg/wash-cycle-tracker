import { describe, expect, test } from 'vitest'
import type { MachineStore } from '../lib/store/types'

// Runs against any `MachineStore` implementation, so a future store (for example the
// localStorage-backed demo store) can reuse the same coverage.
export function runMachineStoreContract(getStore: () => MachineStore) {
  describe('machine operations', () => {
    test('creates, lists and gets a machine', async () => {
      const store = getStore()
      const machine = await store.createMachine('Home')
      expect(machine.name).toBe('Home')

      const machines = await store.listMachines()
      expect(machines.map((item) => item.id)).toContain(machine.id)

      const details = await store.getMachine(machine.id)
      expect(details?.name).toBe('Home')
      expect(details?.entries).toEqual([])
    })

    test('rejects an empty or too-long name on create', async () => {
      const store = getStore()
      await expect(store.createMachine('')).rejects.toThrow()
      await expect(store.createMachine('a'.repeat(101))).rejects.toThrow()
    })

    test('renames a machine', async () => {
      const store = getStore()
      const machine = await store.createMachine('Old name')
      const renamed = await store.renameMachine(machine.id, 'New name')
      expect(renamed.name).toBe('New name')

      const details = await store.getMachine(machine.id)
      expect(details?.name).toBe('New name')
    })

    test('rejects an invalid name on rename', async () => {
      const store = getStore()
      const machine = await store.createMachine('Keep me')
      await expect(store.renameMachine(machine.id, '')).rejects.toThrow()
    })

    test('reports not found when renaming an unknown machine', async () => {
      const store = getStore()
      await expect(store.renameMachine(999_999, 'Nope')).rejects.toThrow()
    })

    test('deletes a machine and cascades to its entries', async () => {
      const store = getStore()
      const machine = await store.createMachine('To delete')
      await store.logEntry(machine.id, 'wash')

      await store.deleteMachine(machine.id)

      const details = await store.getMachine(machine.id)
      expect(details).toBeNull()
    })

    test('reports not found when deleting an unknown machine', async () => {
      const store = getStore()
      await expect(store.deleteMachine(999_999)).rejects.toThrow()
    })
  })
}
