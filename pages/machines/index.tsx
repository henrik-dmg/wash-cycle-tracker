import { auth0 } from '../../lib/auth0'
import { fetchMachinesForUser } from '../../lib/machine.service'
import { Machine } from '../../lib/generated/prisma/client'
import type { NextPage } from 'next'
import Link from 'next/link'
import styles from '../../styles/Default.module.css'
import { PlusIcon, ArrowRightIcon, Squares2X2Icon } from '@heroicons/react/24/outline'

interface Props {
  user: any
  machines: Machine[]
}

const MachinesPage: NextPage<Props> = (props) => {
  return (
    <main className={styles.defaultContainer}>
      <div className="flex flex-wrap items-center justify-between gap-4 py-10">
        <div>
          <span className="stat-chip">
            <Squares2X2Icon className="h-3.5 w-3.5" />
            {props.machines.length} machine{props.machines.length === 1 ? '' : 's'}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-zinc-900 dark:text-white">Your machines</h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-300">Pick a machine to view its cycle history.</p>
        </div>
        <Link
          href="/machines/create"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-colors hover:from-indigo-600 hover:to-purple-700"
        >
          <PlusIcon className="h-4 w-4" />
          Add machine
        </Link>
      </div>

      {props.machines.length === 0 && (
        <div className="glass-card p-10 text-center text-zinc-600 dark:text-zinc-300">
          No machines yet. Add your first one to start tracking cycles.
        </div>
      )}

      <div className="grid gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {props.machines.map((machine) => (
          <Link key={machine.id} href={`/machines/${machine.id}`} className="glass-card group block p-6 transition-transform hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{machine.name}</h2>
              <ArrowRightIcon className="h-4 w-4 flex-shrink-0 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-indigo-500" />
            </div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">ID {machine.id}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}

export default MachinesPage

export const getServerSideProps = auth0.withPageAuthRequired({
  async getServerSideProps(context) {
    try {
      const session = await auth0.getSession(context.req)
      if (!session) {
        throw "User session doesn't exist"
      }
      const { user } = session
      const machines = await fetchMachinesForUser(user.sub)
      return { props: { machines: machines } }
    } catch (error) {
      console.error(error)
      throw error
    }
  },
})
