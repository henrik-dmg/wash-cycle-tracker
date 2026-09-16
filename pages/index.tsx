import Head from 'next/head'
import Link from 'next/link'
import type { NextPage } from 'next'
import { useUser } from '@auth0/nextjs-auth0'
import {
  ArrowRightIcon,
  BellAlertIcon,
  BoltIcon,
  ChartBarIcon,
  CheckIcon,
  CheckBadgeIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import styles from '../styles/Default.module.css'

const features = [
  {
    icon: ClockIcon,
    title: 'Real-time status',
    description: 'See which machines are free, running, or finished the moment a cycle is logged.',
  },
  {
    icon: ChartBarIcon,
    title: 'Usage analytics',
    description: 'Track wash and clean cycles over time to spot busy hours and plan maintenance.',
  },
  {
    icon: UserGroupIcon,
    title: 'Shared access',
    description: 'Give every resident their own account, scoped to the machines they can use.',
  },
  {
    icon: BellAlertIcon,
    title: 'Instant alerts',
    description: 'Toast notifications confirm every logged cycle, so nothing goes unrecorded.',
  },
  {
    icon: ClipboardDocumentListIcon,
    title: 'Full audit trail',
    description: 'Every action is stamped with a user and a timestamp for a complete history.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure by default',
    description: 'Sign-in runs on Auth0, so credentials never touch our own servers.',
  },
]

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    cadence: '',
    description: 'For a single laundry room getting off the ground.',
    features: ['Up to 3 machines', '1 building', 'Cycle logging', 'Community support'],
    cta: 'Get started',
    highlighted: false,
  },
  {
    name: 'Team',
    price: '$9',
    cadence: '/ month',
    description: 'For a residence with several shared machines.',
    features: ['Unlimited machines', 'Up to 5 buildings', 'Usage analytics', 'Priority email support'],
    cta: 'Start free trial',
    highlighted: true,
  },
  {
    name: 'Property',
    price: '$29',
    cadence: '/ month',
    description: 'For a property manager running many buildings.',
    features: ['Everything in Team', 'Unlimited buildings', 'Admin roles', 'Priority support'],
    cta: 'Talk to us',
    highlighted: false,
  },
]

const trustBadges = [
  { icon: ShieldCheckIcon, label: 'Auth0-secured sign-in' },
  { icon: LockClosedIcon, label: 'Encrypted sessions' },
  { icon: BoltIcon, label: '99.9% uptime target' },
  { icon: CheckBadgeIcon, label: 'Full audit trail' },
]

const weeklyCycles = [38, 52, 46, 61, 58, 74, 49]

const HomePage: NextPage = () => {
  const { user } = useUser()
  const primaryHref = user ? '/machines' : '/auth/login'
  const primaryLabel = user ? 'Go to your machines' : 'Get started free'

  return (
    <>
      <Head>
        <title>Washing Machine Server</title>
      </Head>
      <main className={styles.defaultContainer}>
        {/* Hero */}
        <section className="grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <span className="stat-chip">
              <BoltIcon className="h-3.5 w-3.5" />
              Real-time laundry room dashboard
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-white">
              Know your machines,
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"> not just your laundry.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-zinc-600 dark:text-zinc-300">
              Washing Machine Server turns every wash and clean cycle into a clear, shared history, so residents
              always know what is free and managers always know what is used.
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
                href="/#pricing"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-6 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                View pricing
              </Link>
            </div>
          </div>

          {/* Live dashboard preview */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Live overview</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                All systems normal
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-white/70 p-3 text-center dark:bg-zinc-800/60">
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">12</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Machines online</p>
              </div>
              <div className="rounded-xl bg-white/70 p-3 text-center dark:bg-zinc-800/60">
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">328</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Cycles this week</p>
              </div>
              <div className="rounded-xl bg-white/70 p-3 text-center dark:bg-zinc-800/60">
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">4 min</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Avg wait time</p>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-white/70 p-4 dark:bg-zinc-800/60">
              <p className="mb-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400">Cycles logged per day</p>
              <div className="flex h-24 items-end gap-2">
                {weeklyCycles.map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-indigo-500 to-purple-400"
                    style={{ height: `${(value / Math.max(...weeklyCycles)) * 100}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feature highlights */}
        <section className="py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Everything a shared laundry room needs</h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-300">
              A focused feature set that keeps residents informed and managers in control.
            </p>
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

        {/* Pricing */}
        <section id="pricing" className="py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Simple, transparent pricing</h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-300">Start free. Upgrade when your building does.</p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-start">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`glass-card flex h-full flex-col p-8 ${plan.highlighted ? 'ring-2 ring-indigo-500 lg:-translate-y-2' : ''}`}
              >
                {plan.highlighted && (
                  <span className="mb-4 inline-flex w-fit items-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{plan.name}</h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{plan.description}</p>
                <p className="mt-6">
                  <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">{plan.price}</span>
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400"> {plan.cadence}</span>
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                      <CheckIcon className="h-4 w-4 flex-shrink-0 text-indigo-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={primaryHref}
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
    </>
  )
}

export default HomePage
