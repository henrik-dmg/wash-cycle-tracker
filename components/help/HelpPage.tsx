import type { ReactNode } from 'react'
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import type { HelpStatus } from '../../lib/help-status'
import styles from '../../styles/Default.module.css'

type Tone = 'good' | 'warning' | 'neutral'

const toneClasses: Record<Tone, string> = {
  good: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
  neutral: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-700/60 dark:text-zinc-200',
}

function StatusBadge({ tone, children }: { tone: Tone; children: ReactNode }) {
  const Icon = tone === 'good' ? CheckCircleIcon : tone === 'warning' ? ExclamationTriangleIcon : InformationCircleIcon
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${toneClasses[tone]}`}>
      <Icon className="h-3.5 w-3.5" />
      {children}
    </span>
  )
}

function StatusRow({ label, value, detail }: { label: string; value: ReactNode; detail?: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="flex flex-col gap-1 sm:items-end sm:text-right">
        <div>{value}</div>
        {detail && <div className="text-xs text-zinc-500 dark:text-zinc-400">{detail}</div>}
      </dd>
    </div>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="glass-card p-6">
      <h2 className="mb-3 text-xl font-bold text-zinc-900 dark:text-white">{title}</h2>
      <div className="flex flex-col gap-3 text-zinc-700 dark:text-zinc-300">{children}</div>
    </section>
  )
}

function Command({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-zinc-900 px-4 py-3 text-sm text-zinc-100 dark:bg-black/40">
      <code>{children}</code>
    </pre>
  )
}

function Code({ children }: { children: string }) {
  return <code className="rounded bg-zinc-200/70 px-1 py-0.5 text-sm dark:bg-zinc-700/70">{children}</code>
}

function Problem({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold text-zinc-900 dark:text-white">{title}</h3>
      {children}
    </div>
  )
}

export default function HelpPage({ status }: { status: HelpStatus }) {
  const { database } = status

  return (
    <main className={styles.defaultContainer}>
      <div className="py-10">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Help</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300">The status of this deployment, and how to update, back up and fix it.</p>
      </div>

      <div className="mx-auto flex max-w-3xl flex-col gap-6 pb-16">
        <section id="status" className="glass-card p-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Status</h2>
          <dl className="mt-2 divide-y divide-zinc-200 dark:divide-zinc-700">
            <StatusRow label="Version" value={<span className="font-mono font-semibold">{status.version}</span>} />
            <StatusRow
              label="Database directory"
              value={database.writable ? <StatusBadge tone="good">Writable</StatusBadge> : <StatusBadge tone="warning">Not writable</StatusBadge>}
              detail={
                <>
                  {database.directory && <span className="font-mono">{database.directory}</span>}
                  {!database.writable && <span className="block">{database.reason}</span>}
                </>
              }
            />
            <StatusRow
              label="APP_PASSWORD"
              value={status.passwordSet ? <StatusBadge tone="good">Set</StatusBadge> : <StatusBadge tone="neutral">Not set</StatusBadge>}
              detail={status.passwordSet ? 'The deployment needs a sign-in.' : 'The deployment is open to everyone who can reach it.'}
            />
          </dl>
        </section>

        <Section id="update" title="Update">
          <p>Pull the new image and start the container again. The container applies the database migrations when it starts, and your data stays in the volume.</p>
          <Command>{'docker compose pull\ndocker compose up -d'}</Command>
          <p>
            Pin the image to a major version tag (for example <Code>:2</Code>) to get fixes and features without a breaking change.
          </p>
        </Section>

        <Section id="backup" title="Back up and restore">
          <p>
            The data is one SQLite file, <Code>/app/data/washing-machine.db</Code>, in the volume of the container. Stop the container first, so that the file is
            consistent. The commands use the service name <Code>app</Code>; use the name from your <Code>docker-compose.yml</Code>.
          </p>
          <p className="font-semibold text-zinc-900 dark:text-white">Back up</p>
          <Command>{'docker compose stop app\ndocker compose cp app:/app/data/washing-machine.db ./washing-machine.db.backup\ndocker compose start app'}</Command>
          <p className="font-semibold text-zinc-900 dark:text-white">Restore</p>
          <Command>
            {
              'docker compose stop app\ndocker compose cp ./washing-machine.db.backup app:/app/data/washing-machine.db\ndocker compose run --rm --no-deps --user root --entrypoint chown app nextjs:nodejs /app/data/washing-machine.db\ndocker compose start app'
            }
          </Command>
          <p>The third restore command gives the file back to the user that runs the app, so that the app can write to it.</p>
        </Section>

        <Section id="problems" title="Common problems">
          <Problem title="The database is not writable">
            <p>
              The status block shows the database directory as not writable, and entries fail to save. The app runs as the user <Code>nextjs</Code> (UID 1001). With a
              named volume, the container fixes the owner at start, so restart it. With a bind mount, give the host directory to that user:
            </p>
            <Command>{'sudo chown -R 1001:1001 ./data\ndocker compose up -d'}</Command>
          </Problem>

          <Problem title="The port is already in use">
            <p>
              Docker stops with <Code>port is already allocated</Code> or <Code>address already in use</Code>. Another service uses the host port. Change the host port,
              the left side of the port mapping, and start again. The container port stays <Code>3000</Code>.
            </p>
            <Command>{'ports:\n  - "8080:3000"'}</Command>
          </Problem>

          <Problem title="Sign-in loop behind a reverse proxy">
            <p>
              After a correct password, the login page opens again. The session cookie is Secure when the request comes over HTTPS, and a browser drops a Secure cookie
              on a plain <Code>http://</Code> page. This happens when a reverse proxy tells the app that the request is HTTPS (for example with{' '}
              <Code>X-Forwarded-Proto: https</Code>), but the browser uses HTTP. Serve the app over HTTPS end to end, or make the proxy forward the protocol that the
              browser really uses.
            </p>
          </Problem>

          <Problem title="The container stops because SESSION_SECRET is missing">
            <p>
              When <Code>APP_PASSWORD</Code> is set, the app needs <Code>SESSION_SECRET</Code> to sign the session cookie, and stops at start without it. Set it to a long
              random value, for example from this command, and start the container again:
            </p>
            <Command>{'openssl rand -base64 32'}</Command>
          </Problem>
        </Section>
      </div>
    </main>
  )
}
