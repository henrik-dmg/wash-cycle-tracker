import Link from 'next/link'
import { connection } from 'next/server'
import { PlusIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { listMachines } from '../lib/machine.service'
import styles from '../styles/Default.module.css'

export default async function HomePage() {
  // The database query must run for each request, not at build time.
  await connection()
  const machines = await listMachines()

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

      {machines.length === 0 && <div className="glass-card p-10 text-center text-zinc-600 dark:text-zinc-300">No machines yet.</div>}

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
          </Link>
        ))}
      </div>
    </main>
  )
}
