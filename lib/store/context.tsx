'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { createApiMachineStore } from './api-store'
import type { MachineStore } from './types'

const MachineStoreContext = createContext<MachineStore | null>(null)

export function MachineStoreProvider({ children }: { children: ReactNode }) {
  const store = useMemo(() => createApiMachineStore(), [])
  return <MachineStoreContext.Provider value={store}>{children}</MachineStoreContext.Provider>
}

// Reads the machine store from context. Must be called within a `MachineStoreProvider`.
export function useMachineStore(): MachineStore {
  const store = useContext(MachineStoreContext)
  if (!store) {
    throw new Error('useMachineStore must be used within a MachineStoreProvider')
  }
  return store
}
