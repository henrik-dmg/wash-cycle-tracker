'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { PlusIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import Loader from '../components/loader/Loader'
import { useMachineStore } from '../lib/store/context'
import type { MachineListItem } from '../lib/store/types'
import styles from '../styles/Default.module.css'

export default function HomePage() {
  const store = useMachineStore()
  const [machines, setMachines] = useState<MachineListItem[] | null>(null)

  useEffect(() => {
    let cancelled = false
    store
      .listMachines()
      .then((result) => {
        if (!cancelled) {
          setMachines(result)
        }
      })
      .catch((error: Error) => toast.error(error.message))
    return () => {
      cancelled = true
    }
  }, [store])

  return (
    <main className={styles.defaultContainer}>
      <div className="flex flex-wrap items-center justify-between gap-4 py-10">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Your machines</h1>
        <Link
          href="/machines/create"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-colors hover:from-indigo-600 hover:to-purple-700"
        >
          <PlusIcon className="h-4 w-4" />
          Add machine
        </Link>
      </div>

      {machines === null && (
        <div className="flex justify-center py-16">
          <Loader isShown />
        </div>
      )}

      {machines?.length === 0 && <div className="glass-card p-10 text-center text-zinc-600 dark:text-zinc-300">No machines yet.</div>}

      {machines && machines.length > 0 && (
        <div className="grid gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3">
          {machines.map((machine) => (
            <Link
              key={machine.id}
              href={`/machines/${machine.id}`}
              className="glass-card group block p-6 transition-transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{machine.name}</h2>
                <ArrowRightIcon className="h-4 w-4 flex-shrink-0 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-indigo-500" />
              </div>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {machine.washesSinceCleaning} {machine.washesSinceCleaning === 1 ? 'wash' : 'washes'} since cleaning
              </p>
              {machine.latestEntryAt && (
                <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500" suppressHydrationWarning>
                  Latest entry: {new Date(machine.latestEntryAt).toLocaleString()}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
