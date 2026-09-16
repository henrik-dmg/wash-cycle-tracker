'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { ArrowDownTrayIcon, ArrowPathIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import { inputClasses } from '../machine/MachineFormFields'
import { buildComposeFile, DEFAULT_HOST_PORT, generateSessionSecret, isValidHostPort } from '../../lib/compose-file'

const labelClasses = 'block text-sm font-semibold text-zinc-700 dark:text-zinc-200'
const buttonClasses =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50'

// Builds a `docker-compose.yml` fully in the browser. The password and the session secret never
// go to a server.
export default function ComposeForm() {
  const [hostPort, setHostPort] = useState(String(DEFAULT_HOST_PORT))
  const [password, setPassword] = useState('')
  // Generated in an event handler, not during render, so the server render and the browser agree.
  const [sessionSecret, setSessionSecret] = useState('')

  const port = Number(hostPort)
  const portIsValid = hostPort.trim() !== '' && isValidHostPort(port)
  const composeFile = portIsValid ? buildComposeFile({ hostPort: port, password, sessionSecret }) : null

  const handlePasswordChange = (value: string) => {
    if (value && !sessionSecret) {
      setSessionSecret(generateSessionSecret())
    }
    setPassword(value)
  }

  const download = () => {
    if (!composeFile) return
    const url = URL.createObjectURL(new Blob([composeFile], { type: 'application/yaml' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'docker-compose.yml'
    document.body.appendChild(link)
    link.click()
    link.remove()
    // Some browsers start the download after the click returns, so release the URL a bit later.
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const copy = async () => {
    if (!composeFile) return
    try {
      await navigator.clipboard.writeText(composeFile)
      toast.success('Copied to the clipboard')
    } catch {
      toast.error('Could not copy. Select the text and copy it by hand.')
    }
  }

  return (
    <div className="glass-card space-y-6 p-6 sm:p-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Get a Compose file</h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-300">
          Fill in the form to build a <code>docker-compose.yml</code>. Everything happens in your browser, so your password never leaves
          this page.
        </p>
      </div>

      <form className="grid gap-5 sm:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
        <div>
          <label htmlFor="compose-host-port" className={labelClasses}>
            Host port
          </label>
          <input
            type="number"
            id="compose-host-port"
            name="hostPort"
            min={1}
            max={65535}
            step={1}
            required
            value={hostPort}
            onChange={(event) => setHostPort(event.target.value)}
            aria-invalid={!portIsValid}
            aria-describedby="compose-host-port-hint"
            className={inputClasses}
          />
          <p id="compose-host-port-hint" className={`mt-1 text-sm ${portIsValid ? 'text-zinc-500 dark:text-zinc-400' : 'text-red-600'}`}>
            {portIsValid ? 'The port on your server that opens the app.' : 'Enter a whole number from 1 to 65535.'}
          </p>
        </div>

        <div>
          <label htmlFor="compose-password" className={labelClasses}>
            Password (optional)
          </label>
          <input
            type="password"
            id="compose-password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => handlePasswordChange(event.target.value)}
            aria-describedby="compose-password-hint"
            className={inputClasses}
          />
          <p id="compose-password-hint" className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Leave it empty to keep the app open on a private network.
          </p>
        </div>
      </form>

      {password && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-600 dark:text-zinc-300">
          <span>A random session secret was generated in your browser.</span>
          <button
            type="button"
            onClick={() => setSessionSecret(generateSessionSecret())}
            className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            <ArrowPathIcon className="h-4 w-4" />
            New secret
          </button>
        </div>
      )}

      <pre className="max-h-96 overflow-auto rounded-lg bg-zinc-900 p-4 text-left text-sm text-zinc-100" aria-label="docker-compose.yml">
        <code>{composeFile ?? '# Enter a valid host port to build the file.'}</code>
      </pre>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={download}
          disabled={!composeFile}
          className={`${buttonClasses} bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-purple-700`}
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          Download docker-compose.yml
        </button>
        <button
          type="button"
          onClick={copy}
          disabled={!composeFile}
          className={`${buttonClasses} border border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800`}
        >
          <ClipboardDocumentIcon className="h-4 w-4" />
          Copy to clipboard
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Next steps</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-zinc-600 dark:text-zinc-300">
          <li>
            Put <code>docker-compose.yml</code> in an empty folder on your server.
          </li>
          <li>
            Run <code>docker compose up -d</code> in that folder.
          </li>
          <li>
            Open <code>http://&lt;your-server&gt;:{portIsValid ? port : DEFAULT_HOST_PORT}</code> and add your first machine.
          </li>
          <li>
            To update later, run <code>docker compose pull</code> and <code>docker compose up -d</code>. Your data stays in the{' '}
            <code>db-data</code> volume.
          </li>
        </ol>
        {password && (
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            The file contains your password and session secret. Keep it private.
          </p>
        )}
      </div>
    </div>
  )
}
