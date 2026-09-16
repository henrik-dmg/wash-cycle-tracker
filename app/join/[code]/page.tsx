import Link from 'next/link'
import { redirect } from 'next/navigation'
import { joinMachine } from '../../../lib/machine.service'
import { requireSession } from '../../../lib/session.utilities'
import styles from '../../../styles/Default.module.css'

// Invite link. A signed-in user who opens the link becomes a member of the machine.
export default async function JoinPage({ params }: PageProps<'/join/[code]'>) {
  const { code } = await params
  const { user } = await requireSession(`/join/${encodeURIComponent(code)}`)
  const machineId = await joinMachine(code, user)
  if (machineId) {
    redirect(`/machines/${machineId}`)
  }

  return (
    <main className={styles.defaultContainer}>
      <div className="glass-card mx-auto mt-16 max-w-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Invite link not valid</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300">
          This invite link does not exist. Ask a member of the machine to send you the current link.
        </p>
        <Link
          href="/machines"
          className="mt-6 inline-flex rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Go to your machines
        </Link>
      </div>
    </main>
  )
}
