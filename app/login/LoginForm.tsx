'use client'

import { useState, type FormEvent } from 'react'
import { LockClosedIcon } from '@heroicons/react/24/outline'
import styles from '../../styles/Default.module.css'
import { inputClasses } from '../../components/machine/MachineFormFields'
import { sendJson } from '../../lib/fetch.utilities'

export default function LoginForm({ next }: { next: string }) {
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const password = (new FormData(event.currentTarget).get('password') as string | null) ?? ''
    setSubmitting(true)
    setError(null)
    try {
      await sendJson<void>('/api/session', 'POST', { password })
      // A full page load, so the server renders the next page with the new session cookie.
      window.location.assign(next)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Something went wrong')
      setSubmitting(false)
    }
  }

  return (
    <main className={styles.defaultContainer}>
      <div className="mx-auto max-w-sm py-16">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Sign in</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300">This deployment is protected with a password.</p>

        <form onSubmit={handleSubmit} className="glass-card mt-8 space-y-5 p-6 sm:p-8">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              autoFocus
              autoComplete="current-password"
              aria-invalid={error !== null}
              aria-describedby={error ? 'password-error' : undefined}
              className={inputClasses}
            />
            {error && (
              <p id="password-error" role="alert" className="mt-2 text-sm font-semibold text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-colors hover:from-indigo-600 hover:to-purple-700 disabled:opacity-60"
          >
            <LockClosedIcon className="h-4 w-4" />
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  )
}
