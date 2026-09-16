'use client'

import { useSyncExternalStore } from 'react'
import toast from 'react-hot-toast'
import { LinkIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import type { Member } from '../../lib/statement'

interface Props {
  members: Member[]
  inviteCode: string
  currentUserId: string
}

const subscribeToNothing = () => () => {}

export default function MembersCard({ members, inviteCode, currentUserId }: Props) {
  // The origin is only known in the browser. During server rendering the link starts with the path.
  const origin = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.origin,
    () => ''
  )
  const inviteUrl = `${origin}/join/${inviteCode}`

  async function copyInviteLink() {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      toast.success('Invite link copied')
    } catch {
      toast.error('Could not copy the link. Select it and copy it manually')
    }
  }

  return (
    <section className="glass-card p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white">
        <UserGroupIcon className="h-5 w-5 text-indigo-500" />
        Members
      </h2>
      <ul className="mt-4 space-y-3">
        {members.map((member) => (
          <li key={member.userId} className="flex items-center gap-3">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
              {member.name.charAt(0).toUpperCase()}
            </span>
            <span className="truncate text-sm font-medium text-zinc-900 dark:text-white">{member.name}</span>
            {member.userId === currentUserId && <span className="text-xs text-zinc-500 dark:text-zinc-400">(you)</span>}
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-zinc-200/60 pt-4 dark:border-zinc-700/60">
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Invite a flatmate</p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Anyone with this link can join after they sign in.</p>
        <div className="mt-2 flex gap-2">
          <input
            readOnly
            value={inviteUrl}
            onFocus={(event) => event.currentTarget.select()}
            aria-label="Invite link"
            className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white/80 px-3 py-1.5 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-200"
          />
          <button
            onClick={copyInviteLink}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:from-indigo-600 hover:to-purple-700"
          >
            <LinkIcon className="h-3.5 w-3.5" />
            Copy
          </button>
        </div>
      </div>
    </section>
  )
}
