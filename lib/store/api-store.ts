import { HttpError, sendJson } from '../fetch.utilities'
import type { EntryItem, EntryKind, MachineDetails, MachineListItem, MachineStore } from './types'

// A `MachineStore` backed by the deployment's HTTP API. This is the only place that calls `fetch`.
export function createApiMachineStore(): MachineStore {
  return {
    listMachines() {
      return sendJson<MachineListItem[]>('/api/machines', 'GET')
    },
    getMachine(machineId) {
      return sendJson<MachineDetails>(`/api/machines/${machineId}`, 'GET').catch((error: unknown) => {
        if (error instanceof HttpError && error.status === 404) {
          return null
        }
        throw error
      })
    },
    createMachine(name) {
      return sendJson<MachineListItem>('/api/machines', 'POST', { name })
    },
    renameMachine(machineId, name) {
      return sendJson<MachineListItem>(`/api/machines/${machineId}`, 'PATCH', { name })
    },
    setCleaningInterval(machineId, cleaningInterval) {
      return sendJson<MachineListItem>(`/api/machines/${machineId}/cleaning-interval`, 'PATCH', { cleaningInterval })
    },
    deleteMachine(machineId) {
      return sendJson<void>(`/api/machines/${machineId}`, 'DELETE')
    },
    logEntry(machineId, kind, occurredAt) {
      return sendJson<EntryItem>(`/api/machines/${machineId}/entries`, 'POST', occurredAt ? { kind, occurredAt } : { kind })
    },
    deleteEntry(machineId, entryId) {
      return sendJson<void>(`/api/machines/${machineId}/entries/${entryId}`, 'DELETE')
    },
  }
}
