'use client'

import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import styles from '../../../styles/Default.module.css'
import type { Machine } from '../../../lib/generated/prisma/client'
import { SyntheticEvent } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'

export default function CreateMachineForm() {
  const router = useRouter()

  const createNewMachineAndNavigate = async (event: SyntheticEvent) => {
    // Get data from the form.
    const target = event.target as typeof event.target & {
      name: { value: string }
      description: { value: string }
    }
    const name = target.name.value // typechecks!
    const description = target.description.value // typechecks!

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify({ name: name, description: description })

    // API endpoint where we send form data.
    const endpoint = '/api/machines/create'

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: 'POST',
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    }

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options)

    if (!response.ok) {
      throw 'Could not create machine'
    }

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result: Machine = await response.json()

    if (result) {
      router.push(`/machines/${result.id}`)
    } else {
      throw 'Could not create machine'
    }
  }

  // Handles the submit event on form submit.
  const handleSubmit = async (event: SyntheticEvent) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault()

    toast.promise(
      createNewMachineAndNavigate(event),
      {
        loading: 'Saving...',
        success: <b>New machine created</b>,
        error: <b>Could not save. Please try again</b>,
      },
      {
        style: {
          minWidth: '250px',
        },
      }
    )
  }

  const inputClasses =
    'mt-1 w-full rounded-lg border border-zinc-300 bg-white/80 px-3 py-2 text-zinc-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-white'

  return (
    <main className={styles.defaultContainer}>
      <div className="mx-auto max-w-lg py-16">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Add a machine</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-300">Register a new washing machine to start logging cycles.</p>

        <form onSubmit={handleSubmit} className="glass-card mt-8 space-y-5 p-6 sm:p-8">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              Machine name
            </label>
            <input type="text" id="name" name="name" required className={inputClasses} placeholder="Basement washer" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              required
              className={inputClasses}
              placeholder="Front-loader next to the dryer"
            />
          </div>
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
