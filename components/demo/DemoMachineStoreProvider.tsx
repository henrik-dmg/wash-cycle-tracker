'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState, type ReactNode } from 'react'
import toast from 'react-hot-toast'
import { ArrowPathIcon, BeakerIcon } from '@heroicons/react/24/outline'
import { MachineStoreContextProvider } from '../../lib/store/context'
import { createLocalStorageMachineStore } from '../../lib/store/local-storage-store'
import styles from '../../styles/Default.module.css'

const DEMO_BASE_PATH = '/demo'

// Gives the tracker screens below it the localStorage store of the demo, and shows the demo
// banner with the reset action. The demo makes no API calls.
export default function DemoMachineStoreProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const store = useMemo(() => createLocalStorageMachineStore(), [])
  // Changing the key remounts the screens, so they load the sample data again after a reset.
  const [generation, setGeneration] = useState(0)

  const resetDemo = () => {
    if (!window.confirm('Reset the demo? This replaces your changes with the sample data.')) {
      return
    }
    store.reset()
    setGeneration((current) => current + 1)
    router.push(DEMO_BASE_PATH)
    toast.success('Demo reset to the sample data')
  }

  return (
    <MachineStoreContextProvider store={store} basePath={DEMO_BASE_PATH}>
      <div className={styles.defaultContainer}>
        <div
          role="note"
          className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200"
        >
          <p className="flex items-start gap-2">
            <BeakerIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <span>
              <strong>This is a demo.</strong> It starts with sample data, and your changes stay in this browser only.
            </span>
          </p>
          <button
            type="button"
            onClick={resetDemo}
            className="inline-flex items-center gap-2 rounded-full border border-amber-400 px-4 py-1.5 font-semibold transition-colors hover:bg-amber-100 dark:border-amber-500/50 dark:hover:bg-amber-500/20"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Reset demo
          </button>
        </div>
      </div>
      <div key={generation}>{children}</div>
    </MachineStoreContextProvider>
  )
}
