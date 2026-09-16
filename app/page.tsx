import Link from 'next/link'
import { auth0 } from '../lib/auth0'
import {
  ArrowDownTrayIcon,
  ArrowRightIcon,
  CheckIcon,
  CircleStackIcon,
  ClipboardDocumentListIcon,
  LinkIcon,
  ReceiptPercentIcon,
  ServerStackIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TagIcon,
} from '@heroicons/react/24/outline'
import styles from '../styles/Default.module.css'

const steps = [
  { title: 'Add your machine', description: 'Give it a name and a price per wash that covers water, power, detergent and wear.' },
  { title: 'Share the invite link', description: 'Send the link to your flatmates. They sign in and join the machine.' },
  { title: 'Log each wash', description: 'Tap "Log wash" when you start a cycle. Log a clean cycle when you descale the drum.' },
  { title: 'See the monthly split', description: 'At the end of the month, every person sees what they owe. Export it as CSV.' },
]

const features = [
  {
    icon: ReceiptPercentIcon,
    title: 'Usage-based split',
    description: 'Each person pays for the washes they logged, not an equal share of the bill.',
  },
  {
    icon: LinkIcon,
    title: 'Invite link',
    description: 'One link adds a flatmate to the machine. No admin setup and no email lists.',
  },
  {
    icon: TagIcon,
    title: 'Price changes stay fair',
    description: 'Every wash keeps the price it was logged with, so a new price never changes old months.',
  },
  {
    icon: SparklesIcon,
    title: 'Care duties count',
    description: 'Clean cycles cost nothing and show in the split, so everyone sees who looks after the machine.',
  },
  {
    icon: ArrowDownTrayIcon,
    title: 'CSV export',
    description: 'Download the split of any month and put it in your shared expense sheet.',
  },
  {
    icon: ClipboardDocumentListIcon,
    title: 'Clear history',
    description: 'See who logged which cycle and when. You can delete a wrong entry of your own.',
  },
]

const plans = [
  {
    name: 'Self-hosted',
    price: 'Free',
    description: 'Run it on your own server, NAS or Raspberry Pi with Docker Compose.',
    features: [
      'Unlimited machines and members',
      'Your data stays on your server',
      'One SQLite file to back up',
      'Bring your own Auth0 tenant',
    ],
    cta: 'Read the setup',
    href: '#self-host',
    highlighted: false,
  },
  {
    name: 'Hosted',
    // Placeholder: the price of the hosted plan is not decided yet.
    price: 'Coming soon',
    description: 'We run the server for you. Sign in and invite your flatmates.',
    features: ['All features of the self-hosted version', 'No server to maintain'],
    cta: 'Try the app',
    href: null,
    highlighted: true,
  },
]

const trustBadges = [
  { icon: ServerStackIcon, label: 'Data on your own server' },
  { icon: CircleStackIcon, label: 'One SQLite file to back up' },
  { icon: ShieldCheckIcon, label: 'Auth0 sign-in' },
  { icon: ArrowDownTrayIcon, label: 'CSV export' },
]

const sampleSplit = [
  { name: 'Mia', washes: 9, cleans: 1, amount: '€7.20' },
  { name: 'Jonas', washes: 5, cleans: 0, amount: '€4.00' },
  { name: 'Aylin', washes: 2, cleans: 1, amount: '€1.60' },
]

const selfHostSnippet = `git clone <repository-url> washing-machine-server
cd washing-machine-server

# Add the Auth0 settings to .env:
# AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET,
# AUTH0_SECRET, APP_BASE_URL
echo 'DATABASE_URL="file:./data/washing-machine.db"' >> .env

docker compose up -d`

export default async function HomePage() {
  const session = await auth0.getSession()
  const user = session?.user
  const primaryHref = user ? '/machines' : '/auth/login'
  const primaryLabel = user ? 'Go to your machines' : 'Start splitting'

  return (
    <main className={styles.defaultContainer}>
      {/* Hero */}
      <section className="grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <span className="stat-chip">
            <ReceiptPercentIcon className="h-3.5 w-3.5" />
            For flat shares and small buildings
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-white">
            Split the washing machine bill
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"> by who actually washes.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-zinc-600 dark:text-zinc-300">
            An equal split is unfair to the person who washes once a month. Log each wash with one tap and see what every flatmate owes. No
            smart plug, no payment app, and you can host it yourself.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={primaryHref}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-colors hover:from-indigo-600 hover:to-purple-700"
            >
              {primaryLabel}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              href="/#self-host"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-6 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Host it yourself
            </Link>
          </div>
        </div>

        {/* Example of a monthly split */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Monthly split · example</span>
            <span className="stat-chip">€0.80 per wash</span>
          </div>
          <table className="mt-5 w-full text-left text-sm text-zinc-600 dark:text-zinc-300">
            <thead className="text-xs uppercase text-zinc-500 dark:text-zinc-400">
              <tr>
                <th className="py-2">Member</th>
                <th className="py-2 text-right">Washes</th>
                <th className="py-2 text-right">Cleans</th>
                <th className="py-2 text-right">Owes</th>
              </tr>
            </thead>
            <tbody>
              {sampleSplit.map((row) => (
                <tr key={row.name} className="border-t border-zinc-200/60 dark:border-zinc-700/60">
                  <td className="py-3">
                    <span className="font-medium text-zinc-900 dark:text-white">{row.name}</span>
                    <div className="mt-1.5 h-1.5 w-32 rounded-full bg-zinc-200/70 dark:bg-zinc-700/60">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        style={{ width: `${(row.washes / 16) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 text-right tabular-nums">{row.washes}</td>
                  <td className="py-3 text-right tabular-nums">{row.cleans}</td>
                  <td className="py-3 text-right font-semibold tabular-nums text-zinc-900 dark:text-white">{row.amount}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-zinc-300 font-semibold text-zinc-900 dark:border-zinc-600 dark:text-white">
                <td className="py-3">Total</td>
                <td className="py-3 text-right tabular-nums">16</td>
                <td className="py-3 text-right tabular-nums">2</td>
                <td className="py-3 text-right tabular-nums">€12.80</td>
              </tr>
            </tfoot>
          </table>
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">An equal split would charge each person €4.27.</p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">How it works</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300">Set it up in two minutes. Your flatmates need only the link.</p>
        </div>
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="glass-card p-6">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white">
                {index + 1}
              </span>
              <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Fair without the spreadsheet</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300">Everything a shared machine needs, and nothing it does not.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="glass-card p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Self-host */}
      <section id="self-host" className="scroll-mt-24 py-16">
        <div className="glass-card grid gap-10 p-8 lg:grid-cols-2 lg:items-center lg:p-12">
          <div>
            <span className="stat-chip">
              <ServerStackIcon className="h-3.5 w-3.5" />
              Self-hostable
            </span>
            <h2 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">Your laundry data stays at home</h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-300">
              The app runs in one Docker container with a SQLite database. Put it on a home server, a NAS or a small VPS. The database is
              one file in a Docker volume, so a backup is one copy command.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Docker Compose file included',
                'The database schema updates when the container starts',
                'Sign-in through your own Auth0 tenant',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <CheckIcon className="h-4 w-4 flex-shrink-0 text-indigo-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <pre className="overflow-x-auto rounded-xl bg-zinc-900 p-5 text-sm leading-relaxed text-zinc-100 dark:bg-black/60">
            <code>{selfHostSnippet}</code>
          </pre>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-24 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Pricing</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300">Host it yourself for free, or let us run it for you.</p>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2 md:items-start">
          {plans.map((plan) => (
            <div key={plan.name} className={`glass-card flex h-full flex-col p-8 ${plan.highlighted ? 'ring-2 ring-indigo-500' : ''}`}>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{plan.name}</h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{plan.description}</p>
              <p className="mt-6 text-4xl font-extrabold text-zinc-900 dark:text-white">{plan.price}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                    <CheckIcon className="h-4 w-4 flex-shrink-0 text-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href ?? primaryHref}
                className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                    : 'border border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-16">
        <div className="glass-card flex flex-wrap items-center justify-center gap-x-10 gap-y-4 px-8 py-8">
          {trustBadges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
              <badge.icon className="h-5 w-5 text-indigo-500" />
              {badge.label}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
