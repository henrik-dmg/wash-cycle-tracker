import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import ComposeForm from './ComposeForm'

const GITHUB_URL = 'https://github.com/henrik-dmg/wash-cycle-tracker'

export default function LandingPage() {
  return (
    <main>
      <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-24 text-center">
        <span className="stat-chip">Self-hosted wash tracker</span>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
          Log every wash. Know when it needs cleaning.
        </h1>
        <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
          Wash Cycle Tracker logs the washes on your machines and shows the washes since the latest cleaning, so
          you always know when it&apos;s due.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-colors hover:from-indigo-600 hover:to-purple-700"
          >
            Try the demo
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-6 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            View on GitHub
          </a>
        </div>
      </section>

      <section id="compose-form" className="mx-auto max-w-2xl px-4 pb-24">
        <ComposeForm />
      </section>
    </main>
  )
}
