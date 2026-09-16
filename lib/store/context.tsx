'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { createApiMachineStore } from './api-store'
import type { MachineStore } from './types'

interface MachineStoreContextValue {
  store: MachineStore
  // The path of the tracker home, for example `/` or `/demo`. Tracker links build on it.
  basePath: string
}

const MachineStoreContext = createContext<MachineStoreContextValue | null>(null)

// Provides `store` to the tracker screens below it. A nested provider replaces an outer one, so
// the demo can swap in its own store under the root layout.
export function MachineStoreContextProvider({
  store,
  basePath,
  children,
}: {
  store: MachineStore
  basePath: string
  children: ReactNode
}) {
  const value = useMemo(() => ({ store, basePath }), [store, basePath])
  return <MachineStoreContext.Provider value={value}>{children}</MachineStoreContext.Provider>
}

// Provides the API store of the deployment.
export function MachineStoreProvider({ children }: { children: ReactNode }) {
  const store = useMemo(() => createApiMachineStore(), [])
  return (
    <MachineStoreContextProvider store={store} basePath="/">
      {children}
    </MachineStoreContextProvider>
  )
}

function useMachineStoreContext(): MachineStoreContextValue {
  const value = useContext(MachineStoreContext)
  if (!value) {
    throw new Error('useMachineStore must be used within a MachineStoreProvider')
  }
  return value
}

// Reads the machine store from context. Must be called within a `MachineStoreProvider`.
export function useMachineStore(): MachineStore {
  return useMachineStoreContext().store
}

// Returns a function that builds a tracker path below the current base path, for example
// `trackerPath('/machines/1')` gives `/machines/1` in a deployment and `/demo/machines/1` in the demo.
export function useTrackerPath(): (path?: string) => string {
  const { basePath } = useMachineStoreContext()
  return (path = '') => {
    const base = basePath.replace(/\/$/, '')
    return base + path || '/'
  }
}
