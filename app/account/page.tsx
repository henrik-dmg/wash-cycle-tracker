import Image from 'next/image'
import styles from '../../styles/Default.module.css'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import { requireSession } from '../../lib/session.utilities'

export default async function AccountPage() {
  const { user } = await requireSession('/account')

  return (
    <main className={styles.defaultContainer}>
      <div className="mx-auto max-w-lg py-16">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Account</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-300">Your profile, signed in through Auth0.</p>

        <div className="glass-card mt-8 flex items-center gap-5 p-6 sm:p-8">
          {user.picture && (
            <Image
              src={user.picture}
              alt={user.name ?? ''}
              width={72}
              height={72}
              className="rounded-full border border-white/60 dark:border-white/10"
            />
          )}
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{user.name}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</p>
            <span className="stat-chip mt-3">
              <ShieldCheckIcon className="h-3.5 w-3.5" />
              Secured sign-in
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
