'use client'

import { FunctionComponent, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ArrowPathIcon, PencilIcon, SparklesIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useMachineStore } from '../../lib/store/context'
import type { EntryItem, EntryKind, MachineDetails } from '../../lib/store/types'
import { highlightableItem } from '../../lib/style.utilities'
import HistoryTable from './HistoryTable'

interface Props {
  machine: MachineDetails
}

const MachineComponent: FunctionComponent<Props> = ({ machine }) => {
  const store = useMachineStore()
  const router = useRouter()
  const [name, setName] = useState(machine.name)
  // Newest first.
  const [entries, setEntries] = useState<EntryItem[]>(machine.entries)

  async function logEntry(kind: EntryKind) {
    try {
      const entry = await store.logEntry(machine.id, kind)
      setEntries((current) => [entry, ...current])
      toast.success(kind === 'wash' ? 'Wash logged' : 'Cleaning logged')
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  async function deleteEntry(entry: EntryItem) {
    try {
      await store.deleteEntry(machine.id, entry.id)
      setEntries((current) => current.filter((other) => other.id !== entry.id))
      toast.success('Entry deleted')
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  async function renameMachine() {
    const nextName = window.prompt('Machine name', name)
    if (nextName === null || nextName.trim() === name) {
      return
    }
    try {
      const renamed = await store.renameMachine(machine.id, nextName.trim())
      setName(renamed.name)
      toast.success('Machine renamed')
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  async function deleteMachine() {
    if (!window.confirm('Delete this machine and all its entries?')) {
      return
    }
    try {
      await store.deleteMachine(machine.id)
      toast.success('Machine deleted')
      router.push('/')
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  return (
    <div className="space-y-6 py-10">
      <div className="glass-card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">{name}</h1>
            <button
              className={highlightableItem('rounded p-1.5 text-zinc-500 dark:text-zinc-400')}
              onClick={renameMachine}
              aria-label="Rename machine"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              className={highlightableItem('rounded p-1.5 text-red-600 dark:text-red-400')}
              onClick={deleteMachine}
              aria-label="Delete machine"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
              onClick={() => logEntry('wash')}
            >
              <ArrowPathIcon className="h-4 w-4" />
              Log wash
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
              onClick={() => logEntry('cleaning')}
            >
              <SparklesIcon className="h-4 w-4" />
              Log cleaning
            </button>
          </div>
        </div>
      </div>

      <HistoryTable entries={entries} onDelete={deleteEntry} />
    </div>
  )
}

export default MachineComponent
