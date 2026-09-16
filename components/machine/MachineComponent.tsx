'use client'

import { FunctionComponent, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { ArrowPathIcon, Cog6ToothIcon, SparklesIcon } from '@heroicons/react/24/outline'
import type { MachineDetails } from '../../lib/machine.service'
import { sendJson } from '../../lib/fetch.utilities'
import { formatMoney } from '../../lib/money'
import { ActionEntry, ActionType, buildStatement, monthKey } from '../../lib/statement'
import MonthlySplit from './MonthlySplit'
import MembersCard from './MembersCard'
import MachineSettings from './MachineSettings'
import HistoryTable from './HistoryTable'

interface Props {
  machine: MachineDetails
  currentUserId: string
}

const MachineComponent: FunctionComponent<Props> = (props) => {
  const [machine, setMachine] = useState(props.machine)
  const [actions, setActions] = useState<ActionEntry[]>(props.machine.actions)
  const [month, setMonth] = useState(() => monthKey(new Date()))
  const [showSettings, setShowSettings] = useState(false)

  const statement = useMemo(() => buildStatement(actions, machine.members, month), [actions, machine.members, month])
  const monthActions = useMemo(() => actions.filter((action) => monthKey(action.date) === month), [actions, month])
  const names = useMemo(() => new Map(machine.members.map((member) => [member.userId, member.name])), [machine.members])

  async function logAction(actionType: ActionType) {
    try {
      const action = await sendJson<ActionEntry>(`/api/machines/${machine.id}/actions`, 'POST', { actionType })
      setActions((current) => current.concat([action]))
      setMonth(monthKey(action.date))
      toast.success(actionType === 'wash' ? `Wash logged: ${formatMoney(action.cost, machine.currency)}` : 'Clean cycle logged')
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  async function deleteAction(action: ActionEntry) {
    try {
      await sendJson<void>(`/api/machines/${machine.id}/actions/${action.id}`, 'DELETE')
      setActions((current) => current.filter((entry) => entry.id !== action.id))
      toast.success('Entry deleted')
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  return (
    <div className="space-y-6 py-10">
      <div className="glass-card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">{machine.name}</h1>
            {machine.description && <p className="mt-1 text-zinc-600 dark:text-zinc-300">{machine.description}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="stat-chip">{formatMoney(machine.costPerWash, machine.currency)} per wash</span>
              <span className="stat-chip">
                {machine.members.length} member{machine.members.length === 1 ? '' : 's'}
              </span>
              <button className="stat-chip hover:text-indigo-600 dark:hover:text-indigo-400" onClick={() => setShowSettings(!showSettings)}>
                <Cog6ToothIcon className="h-3.5 w-3.5" />
                {showSettings ? 'Close settings' : 'Settings'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
              onClick={() => logAction('wash')}
            >
              <ArrowPathIcon className="h-4 w-4" />
              Log wash
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
              onClick={() => logAction('clean')}
            >
              <SparklesIcon className="h-4 w-4" />
              Log clean
            </button>
          </div>
        </div>

        {showSettings && (
          <MachineSettings
            machine={machine}
            currencyLocked={actions.some((action) => action.cost > 0)}
            onSaved={(changes) => {
              setMachine({ ...machine, ...changes })
              setShowSettings(false)
            }}
          />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MonthlySplit machineId={machine.id} currency={machine.currency} statement={statement} onChangeMonth={setMonth} />
        </div>
        <MembersCard members={machine.members} inviteCode={machine.inviteCode} currentUserId={props.currentUserId} />
      </div>

      <HistoryTable
        actions={monthActions}
        names={names}
        currency={machine.currency}
        currentUserId={props.currentUserId}
        onDelete={deleteAction}
      />
    </div>
  )
}

export default MachineComponent
