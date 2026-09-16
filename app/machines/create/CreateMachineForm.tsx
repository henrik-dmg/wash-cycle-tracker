'use client'

import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import styles from '../../../styles/Default.module.css'
import { FormEvent } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import MachineFormFields, { readMachineForm } from '../../../components/machine/MachineFormFields'
import { useMachineStore, useTrackerPath } from '../../../lib/store/context'

export default function CreateMachineForm() {
  const router = useRouter()
  const store = useMachineStore()
  const trackerPath = useTrackerPath()

  const createNewMachineAndNavigate = async (form: HTMLFormElement) => {
    const { name } = readMachineForm(form)
    const machine = await store.createMachine(name)
    router.push(trackerPath(`/machines/${machine.id}`))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    toast.promise(createNewMachineAndNavigate(event.currentTarget), {
      loading: 'Saving...',
      success: <b>New machine created</b>,
      error: (error: Error) => <b>{error.message}</b>,
    })
  }

  return (
    <main className={styles.defaultContainer}>
      <div className="mx-auto max-w-lg py-16">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Add a machine</h1>

        <form onSubmit={handleSubmit} className="glass-card mt-8 space-y-5 p-6 sm:p-8">
          <MachineFormFields />
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-colors hover:from-indigo-600 hover:to-purple-700"
          >
            <PlusIcon className="h-4 w-4" />
            Create machine
          </button>
        </form>
      </div>
    </main>
  )
}
