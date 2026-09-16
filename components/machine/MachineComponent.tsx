'use client'

import { highlightableItem } from '../../lib/style.utilities'
import { Action } from '../../lib/generated/prisma/client'
import { FunctionComponent, useState } from 'react'
import toast from 'react-hot-toast'
import { MachineWithActions } from '../../lib/machine.service'
import { ArrowPathIcon, ClipboardDocumentListIcon, SparklesIcon } from '@heroicons/react/24/outline'

interface Props {
  machine: MachineWithActions
}

const MachineComponent: FunctionComponent<Props> = (props) => {
  const [actions, setActions] = useState(props.machine.actions ?? [])

  async function logAction(actionType: string) {
    // API endpoint where we send form data.
    const endpoint = `/api/machines/${props.machine.id}/${actionType}`

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: 'POST',
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
      },
    }
    try {
      // Send the form data to our forms API on Vercel and get a response.
      const response = await fetch(endpoint, options)

      if (!response.ok) {
        throw 'Could not create machine'
      }

      // Get the response data from server as JSON.
      // If server returns the name submitted, that means the form works.
      const action: Action = await response.json()
      setActions(actions.concat([action]))
      toast.success(`Successfully logged ${actionType} cycle`)
    } catch (error) {
      toast.error('Something went wrong')
      console.error(error)
    }
  }

  const lastAction = actions[actions.length - 1]

  return (
    <div key={props.machine.id} className="py-10">
      <div className="glass-card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">{props.machine.name}</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              ID {props.machine.id} · Added {new Date(props.machine.createdAt).toLocaleDateString()}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="stat-chip">
                <ClipboardDocumentListIcon className="h-3.5 w-3.5" />
                {actions.length} cycle{actions.length === 1 ? '' : 's'} logged
              </span>
              {lastAction && (
                <span className="stat-chip">Last: {lastAction.actionType} on {new Date(lastAction.date).toLocaleDateString()}</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
              onClick={() => logAction('wash')}
            >
              <ArrowPathIcon className="h-4 w-4" />
              Log wash cycle
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
              onClick={() => logAction('clean')}
            >
              <SparklesIcon className="h-4 w-4" />
              Log clean cycle
            </button>
          </div>
        </div>
      </div>

      {actions.length > 0 && (
        <div className="glass-card mt-6 overflow-x-auto p-2">
          <table className="w-full table-fixed text-left text-sm text-zinc-600 dark:text-zinc-300">
            <thead className="text-xs uppercase text-zinc-500 dark:text-zinc-400">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Action
                </th>
                <th scope="col" className="px-4 py-3">
                  Logged by
                </th>
                <th scope="col" className="px-4 py-3">
                  Date
                </th>
                <th scope="col" className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {actions
                .slice()
                .reverse()
                .map((action) => (
                  <tr key={action.id} className="border-t border-zinc-200/60 dark:border-zinc-700/60">
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          action.actionType === 'wash'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                        }`}
                      >
                        {action.actionType}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{action.userId}</td>
                    <td className="px-4 py-3">{new Date(action.date).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button className={highlightableItem('rounded px-2 py-1 font-medium text-red-600 dark:text-red-400')}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MachineComponent
