'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Loader from '../loader/Loader'
import MachineComponent from '../machine/MachineComponent'
import { useMachineStore, useTrackerPath } from '../../lib/store/context'
import type { MachineDetails } from '../../lib/store/types'
import styles from '../../styles/Default.module.css'

// The machine detail screen, loaded through the machine store in the browser. The demo uses it,
// because the demo data lives in the browser and not on the server.
export default function StoreMachinePage({ machineId }: { machineId: number }) {
  const store = useMachineStore()
  const trackerPath = useTrackerPath()
  // `undefined` while loading, `null` when the machine does not exist.
  const [machine, setMachine] = useState<MachineDetails | null | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    store
      .getMachine(machineId)
      .then((result) => {
        if (!cancelled) {
          setMachine(result)
        }
      })
      .catch((error: Error) => toast.error(error.message))
    return () => {
      cancelled = true
    }
  }, [store, machineId])

  return (
    <main className={styles.defaultContainer}>
      {machine === undefined && (
        <div className="flex justify-center py-16">
          <Loader isShown />
        </div>
      )}
      {machine === null && (
        <div className="glass-card my-10 p-10 text-center text-zinc-600 dark:text-zinc-300">
          <p>This machine does not exist.</p>
          <Link href={trackerPath()} className="mt-4 inline-block font-semibold text-indigo-600 dark:text-indigo-400">
            Back to the machines
          </Link>
        </div>
      )}
      {machine && <MachineComponent key={machine.id} machine={machine} />}
    </main>
  )
}
