'use client'

import { highlightableItem } from '../../lib/style.utilities'
import type { EntryItem } from '../../lib/machine.model'

interface Props {
  // Newest first.
  entries: EntryItem[]
  onDelete: (entry: EntryItem) => void
}

// Lists the entries of a machine in the given order.
export default function HistoryTable({ entries, onDelete }: Props) {
  if (entries.length === 0) {
    return <div className="glass-card p-6 text-center text-sm text-zinc-500 dark:text-zinc-400">No entries yet.</div>
  }

  return (
    <div className="glass-card overflow-x-auto p-2">
      <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-300">
        <thead className="text-xs uppercase text-zinc-500 dark:text-zinc-400">
          <tr>
            <th scope="col" className="px-4 py-3">
              Kind
            </th>
            <th scope="col" className="px-4 py-3">
              Date
            </th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-t border-zinc-200/60 dark:border-zinc-700/60">
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                    entry.kind === 'wash'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                  }`}
                >
                  {entry.kind}
                </span>
              </td>
              {/* The server and the browser can have different time zones. */}
              <td className="px-4 py-3" suppressHydrationWarning>
                {new Date(entry.occurredAt).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  className={highlightableItem('rounded px-2 py-1 font-medium text-red-600 dark:text-red-400')}
                  onClick={() => {
                    if (window.confirm('Delete this entry?')) {
                      onDelete(entry)
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
