'use client'

import { FunctionComponent, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ArrowPathIcon, ClockIcon, PencilIcon, SparklesIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useMachineStore } from '../../lib/store/context'
import type { EntryItem, EntryKind, MachineDetails } from '../../lib/store/types'
// Imported straight from the domain module, not through the store seam: re-exporting a value
// through `store/types.ts` trips a Turbopack dev-mode bug that leaves the machine page unbuilt.
import { washesSinceCleaning } from '../../lib/entry.domain'
import { highlightableItem } from '../../lib/style.utilities'
import HistoryTable from './HistoryTable'

interface Props {
  machine: MachineDetails
}

// Converts a `datetime-local` input value, which has no time zone, to a UTC ISO string.
function localInputToIso(value: string): string {
  return new Date(value).toISOString()
}

const MachineComponent: FunctionComponent<Props> = ({ machine }) => {
  const store = useMachineStore()
  const router = useRouter()
  const [name, setName] = useState(machine.name)
  // Newest first.
  const [entries, setEntries] = useState<EntryItem[]>(machine.entries)
  const [showChosenTimeForm, setShowChosenTimeForm] = useState(false)
  const [chosenKind, setChosenKind] = useState<EntryKind>('wash')
  const [chosenTime, setChosenTime] = useState('')

  // Calculated from the entry times, not the order they were logged in.
  const sinceCleaning = useMemo(() => washesSinceCleaning(entries), [entries])

  async function logEntry(kind: EntryKind, occurredAt?: string) {
    try {
      const entry = await store.logEntry(machine.id, kind, occurredAt)
      setEntries((current) => [entry, ...current].sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt)))
      toast.success(kind === 'wash' ? 'Wash logged' : 'Cleaning logged')
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  async function logEntryAtChosenTime() {
    if (!chosenTime) {
      toast.error('Choose a date and time')
      return
    }
    await logEntry(chosenKind, localInputToIso(chosenTime))
    setShowChosenTimeForm(false)
    setChosenTime('')
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
          <div>
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
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {sinceCleaning} {sinceCleaning === 1 ? 'wash' : 'washes'} since cleaning
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
            <button
              className={highlightableItem(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300'
              )}
              onClick={() => setShowChosenTimeForm((current) => !current)}
              aria-expanded={showChosenTimeForm}
            >
              <ClockIcon className="h-4 w-4" />
              Log at a chosen time
            </button>
          </div>
        </div>

        {showChosenTimeForm && (
          <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-zinc-200/60 pt-4 dark:border-zinc-700/60">
            <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-300">
              Kind
              <select
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                value={chosenKind}
                onChange={(event) => setChosenKind(event.target.value as EntryKind)}
              >
                <option value="wash">Wash</option>
                <option value="cleaning">Cleaning</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-300">
              Date and time
              <input
                type="datetime-local"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                value={chosenTime}
                onChange={(event) => setChosenTime(event.target.value)}
              />
            </label>
            <button
              className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-600"
              onClick={logEntryAtChosenTime}
            >
              Log entry
            </button>
          </div>
        )}
      </div>

      <HistoryTable entries={entries} onDelete={deleteEntry} />
    </div>
  )
}

export default MachineComponent
