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

  describe('entry operations', () => {
    test('logs a wash at the current time', async () => {
      const store = getStore()
      const machine = await store.createMachine('Log now')
      const before = Date.now()
      const entry = await store.logEntry(machine.id, 'wash')
      expect(entry.kind).toBe('wash')
      expect(Date.parse(entry.occurredAt)).toBeGreaterThanOrEqual(before - 1000)
    })

    test('logs a cleaning at a chosen time', async () => {
      const store = getStore()
      const machine = await store.createMachine('Log at time')
      const chosen = new Date('2020-06-15T08:30:00.000Z').toISOString()
      const entry = await store.logEntry(machine.id, 'cleaning', chosen)
      expect(entry.kind).toBe('cleaning')
      expect(entry.occurredAt).toBe(chosen)
    })

    test('shows the history newest first with the kind of each entry', async () => {
      const store = getStore()
      const machine = await store.createMachine('History order')
      await store.logEntry(machine.id, 'wash', new Date('2024-01-01T00:00:00.000Z').toISOString())
      await store.logEntry(machine.id, 'cleaning', new Date('2024-01-03T00:00:00.000Z').toISOString())
      await store.logEntry(machine.id, 'wash', new Date('2024-01-02T00:00:00.000Z').toISOString())

      const details = await store.getMachine(machine.id)
      expect(details?.entries.map((entry) => entry.kind)).toEqual(['cleaning', 'wash', 'wash'])
    })

    test('deletes an entry', async () => {
      const store = getStore()
      const machine = await store.createMachine('Delete entry')
      const entry = await store.logEntry(machine.id, 'wash')

      await store.deleteEntry(machine.id, entry.id)

      const details = await store.getMachine(machine.id)
      expect(details?.entries).toEqual([])
    })

    test('reports not found when deleting an unknown entry', async () => {
      const store = getStore()
      const machine = await store.createMachine('No such entry')
      await expect(store.deleteEntry(machine.id, 999_999)).rejects.toThrow()
    })
  })

  describe('washes since cleaning', () => {
    test('counts all washes when the machine has no cleaning', async () => {
      const store = getStore()
      const machine = await store.createMachine('No cleaning yet')
      await store.logEntry(machine.id, 'wash')
      await store.logEntry(machine.id, 'wash')

      const details = await store.getMachine(machine.id)
      expect(details?.washesSinceCleaning).toBe(2)
    })

    test('counts only the washes after the latest cleaning', async () => {
      const store = getStore()
      const machine = await store.createMachine('With cleaning')
      await store.logEntry(machine.id, 'wash', new Date('2024-01-01T00:00:00.000Z').toISOString())
      await store.logEntry(machine.id, 'cleaning', new Date('2024-01-02T00:00:00.000Z').toISOString())
      await store.logEntry(machine.id, 'wash', new Date('2024-01-03T00:00:00.000Z').toISOString())

      const details = await store.getMachine(machine.id)
      expect(details?.washesSinceCleaning).toBe(1)
    })

    test('counts a late entry by its own time, not the order it was logged in', async () => {
      const store = getStore()
      const machine = await store.createMachine('Late entry')
      await store.logEntry(machine.id, 'cleaning', new Date('2024-02-02T00:00:00.000Z').toISOString())
      // Logged after the cleaning call above, but its own time is earlier than the cleaning.
      await store.logEntry(machine.id, 'wash', new Date('2024-02-01T00:00:00.000Z').toISOString())

      const details = await store.getMachine(machine.id)
      expect(details?.washesSinceCleaning).toBe(0)
    })

    test('updates the count after a delete', async () => {
      const store = getStore()
      const machine = await store.createMachine('Delete updates count')
      const firstWash = await store.logEntry(machine.id, 'wash')
      await store.logEntry(machine.id, 'wash')

      let details = await store.getMachine(machine.id)
      expect(details?.washesSinceCleaning).toBe(2)

      await store.deleteEntry(machine.id, firstWash.id)

      details = await store.getMachine(machine.id)
      expect(details?.washesSinceCleaning).toBe(1)
    })
  })
}
