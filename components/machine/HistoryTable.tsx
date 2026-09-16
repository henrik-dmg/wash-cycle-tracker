'use client'

import { highlightableItem } from '../../lib/style.utilities'
import { formatMoney } from '../../lib/money'
import { sanitiseUsername } from '../../lib/usernameSanitisation'
import type { ActionEntry } from '../../lib/statement'

interface Props {
  actions: ActionEntry[]
  names: Map<string, string>
  currency: string
  currentUserId: string
  onDelete: (action: ActionEntry) => void
}

// Lists the entries of the selected month, newest first. Members can delete only their own entries.
export default function HistoryTable({ actions, names, currency, currentUserId, onDelete }: Props) {
  if (actions.length === 0) {
    return <div className="glass-card p-6 text-center text-sm text-zinc-500 dark:text-zinc-400">No cycles logged in this month.</div>
  }

  return (
    <div className="glass-card overflow-x-auto p-2">
      <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-300">
        <thead className="text-xs uppercase text-zinc-500 dark:text-zinc-400">
          <tr>
            <th scope="col" className="px-4 py-3">
              Cycle
            </th>
            <th scope="col" className="px-4 py-3">
              Logged by
            </th>
            <th scope="col" className="px-4 py-3">
              Date
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              Cost
            </th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Actions</span>
            </th>
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
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">
                  {names.get(action.userId) ?? sanitiseUsername(action.userId)}
                </td>
                {/* The server and the browser can have different time zones. */}
                <td className="px-4 py-3" suppressHydrationWarning>
                  {new Date(action.date).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{formatMoney(action.cost, currency)}</td>
                <td className="px-4 py-3 text-right">
                  {action.userId === currentUserId && (
                    <button
                      className={highlightableItem('rounded px-2 py-1 font-medium text-red-600 dark:text-red-400')}
                      onClick={() => {
                        if (window.confirm('Delete this entry?')) {
                          onDelete(action)
                        }
                      }}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
