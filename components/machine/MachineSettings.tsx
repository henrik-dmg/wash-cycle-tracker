'use client'

import { FormEvent } from 'react'
import toast from 'react-hot-toast'
import type { MachineDetails } from '../../lib/machine.service'
import { sendJson } from '../../lib/fetch.utilities'
import MachineFormFields, { MachineFormValues, readMachineForm } from './MachineFormFields'

interface Props {
  machine: MachineDetails
  currencyLocked: boolean
  onSaved: (changes: MachineFormValues) => void
}

// Lets a member change the name, description and price. Old entries keep the price they were logged with.
export default function MachineSettings({ machine, currencyLocked, onSaved }: Props) {
  async function save(form: HTMLFormElement) {
    const values = readMachineForm(form, machine.currency)
    await sendJson(`/api/machines/${machine.id}`, 'PATCH', values)
    onSaved(values)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    toast.promise(save(event.currentTarget), {
      loading: 'Saving...',
      success: 'Settings saved',
      error: (error: Error) => error.message,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-4 border-t border-zinc-200/60 pt-6 dark:border-zinc-700/60">
      <MachineFormFields
        name={machine.name}
        description={machine.description}
        costPerWash={machine.costPerWash}
        currency={machine.currency}
        currencyLocked={currencyLocked}
      />
      <p className="text-xs text-zinc-500 dark:text-zinc-400">A new price applies to new washes only.</p>
      <button
        type="submit"
        className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2 text-sm font-semibold text-white hover:from-indigo-600 hover:to-purple-700"
      >
        Save settings
      </button>
    </form>
  )
}
