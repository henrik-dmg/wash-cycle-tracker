'use client'

import { ArrowDownTrayIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { formatMoney } from '../../lib/money'
import { formatMonth, monthKey, shiftMonth, Statement } from '../../lib/statement'

interface Props {
  machineId: number
  currency: string
  statement: Statement
  onChangeMonth: (month: string) => void
}

const navButtonClasses =
  'inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-600 transition-colors hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-transparent dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'

// Shows what each member owes for the selected month.
export default function MonthlySplit({ machineId, currency, statement, onChangeMonth }: Props) {
  const { month, rows, totalWashes, totalCleans, totalAmount } = statement
  const isCurrentMonth = month >= monthKey(new Date())

  return (
    <section className="glass-card h-full p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Monthly split</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Each person pays for the washes they logged.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className={navButtonClasses} onClick={() => onChangeMonth(shiftMonth(month, -1))} aria-label="Previous month">
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <span className="min-w-32 text-center text-sm font-semibold text-zinc-900 dark:text-white">{formatMonth(month)}</span>
          <button
            className={navButtonClasses}
            onClick={() => onChangeMonth(shiftMonth(month, 1))}
            disabled={isCurrentMonth}
            aria-label="Next month"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-300">
          <thead className="text-xs uppercase text-zinc-500 dark:text-zinc-400">
            <tr>
              <th scope="col" className="py-2 pr-4">
                Member
              </th>
              <th scope="col" className="px-4 py-2 text-right">
                Washes
              </th>
              <th scope="col" className="px-4 py-2 text-right">
                Cleans
              </th>
              <th scope="col" className="py-2 pl-4 text-right">
                Owes
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.userId} className="border-t border-zinc-200/60 dark:border-zinc-700/60">
                <td className="py-3 pr-4">
                  <span className="font-medium text-zinc-900 dark:text-white">{row.name}</span>
                  <div className="mt-1.5 h-1.5 w-full max-w-40 rounded-full bg-zinc-200/70 dark:bg-zinc-700/60">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      style={{ width: `${totalAmount ? (row.amount / totalAmount) * 100 : 0}%` }}
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{row.washes}</td>
                <td className="px-4 py-3 text-right tabular-nums">{row.cleans}</td>
                <td className="py-3 pl-4 text-right font-semibold tabular-nums text-zinc-900 dark:text-white">
                  {formatMoney(row.amount, currency)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-zinc-300 font-semibold text-zinc-900 dark:border-zinc-600 dark:text-white">
              <td className="py-3 pr-4">Total</td>
              <td className="px-4 py-3 text-right tabular-nums">{totalWashes}</td>
              <td className="px-4 py-3 text-right tabular-nums">{totalCleans}</td>
              <td className="py-3 pl-4 text-right tabular-nums">{formatMoney(totalAmount, currency)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <a
        href={`/api/machines/${machineId}/statement?month=${month}`}
        download
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
        Download CSV
      </a>
    </section>
  )
}
