import { randomUUID } from 'node:crypto'
import { unlink, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import packageManifest from '../package.json'

// The checks behind the status block on the help page. They only read env variables and the file
// system, and never import the database module.

export type WritableCheck = { writable: true; directory: string } | { writable: false; directory: string | null; reason: string }

// The env variables that the checks read. Tests pass a plain object in place of `process.env`.
type Env = Record<string, string | undefined>

export interface HelpStatus {
  version: string
  database: WritableCheck
  passwordSet: boolean
}

// The version of the app, from the package manifest.
export const appVersion: string = packageManifest.version

// Finds the directory of the SQLite file in a `file:` database URL, in the same way as the
// better-sqlite3 adapter: strip the `file:` prefix and resolve a relative path against `cwd`.
// Returns null when the URL is not set or is not a file URL.
export function databaseDirectoryFromUrl(databaseUrl: string | undefined, cwd: string = process.cwd()): string | null {
  if (!databaseUrl || !databaseUrl.startsWith('file:')) {
    return null
  }
  const filePath = databaseUrl.slice('file:'.length)
  if (filePath === '') {
    return null
  }
  return dirname(resolve(cwd, filePath))
}

// Checks that a directory is writable with a real write: it creates a small file and deletes it
// again. A permission check alone can pass on a volume that refuses writes.
export async function checkDirectoryWritable(directory: string): Promise<WritableCheck> {
  const probePath = join(directory, `.write-check-${randomUUID()}`)
  try {
    await writeFile(probePath, 'ok', { flag: 'wx' })
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code
    return { writable: false, directory, reason: code ? `The write failed with ${code}.` : 'The write failed.' }
  }
  await unlink(probePath).catch(() => undefined)
  return { writable: true, directory }
}

// Checks the directory of the database in DATABASE_URL.
export async function checkDatabaseDirectoryWritable(env: Env = process.env): Promise<WritableCheck> {
  const directory = databaseDirectoryFromUrl(env.DATABASE_URL)
  if (!directory) {
    return { writable: false, directory: null, reason: 'DATABASE_URL is not set to a file: URL.' }
  }
  return checkDirectoryWritable(directory)
}

// Tells whether APP_PASSWORD is set. An empty value counts as not set. The value itself never
// leaves this function.
export function isPasswordSet(env: Env = process.env): boolean {
  const password = env.APP_PASSWORD
  return typeof password === 'string' && password !== ''
}

export async function getHelpStatus(env: Env = process.env): Promise<HelpStatus> {
  return {
    version: appVersion,
    database: await checkDatabaseDirectoryWritable(env),
    passwordSet: isPasswordSet(env),
  }
}
