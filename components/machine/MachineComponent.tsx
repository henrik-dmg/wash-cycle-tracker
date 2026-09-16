'use client'

import { FunctionComponent, useState } from 'react'
import toast from 'react-hot-toast'
import { ArrowPathIcon, SparklesIcon } from '@heroicons/react/24/outline'
import type { EntryItem, EntryKind, MachineDetails } from '../../lib/machine.service'
import { sendJson } from '../../lib/fetch.utilities'
import HistoryTable from './HistoryTable'

interface Props {
  machine: MachineDetails
}

const MachineComponent: FunctionComponent<Props> = ({ machine }) => {
  // Newest first.
  const [entries, setEntries] = useState<EntryItem[]>(machine.entries)

  async function logEntry(kind: EntryKind) {
    try {
      const entry = await sendJson<EntryItem>(`/api/machines/${machine.id}/entries`, 'POST', { kind })
      setEntries((current) => [entry, ...current])
      toast.success(kind === 'wash' ? 'Wash logged' : 'Cleaning logged')
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  async function deleteEntry(entry: EntryItem) {
    try {
      await sendJson<void>(`/api/machines/${machine.id}/entries/${entry.id}`, 'DELETE')
      setEntries((current) => current.filter((other) => other.id !== entry.id))
      toast.success('Entry deleted')
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  return (
    <div className="space-y-6 py-10">
      <div className="glass-card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">{machine.name}</h1>

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
