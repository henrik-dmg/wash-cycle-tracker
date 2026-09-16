import { chmodSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, test } from 'vitest'
import {
  appVersion,
  checkDatabaseDirectoryWritable,
  checkDirectoryWritable,
  databaseDirectoryFromUrl,
  getHelpStatus,
  isPasswordSet,
} from '../lib/help-status'

const temporaryDirectories: string[] = []

function makeTemporaryDirectory(): string {
  const directory = mkdtempSync(join(tmpdir(), 'help-status-test-'))
  temporaryDirectories.push(directory)
  return directory
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    chmodSync(directory, 0o755)
    rmSync(directory, { recursive: true, force: true })
  }
})

describe('appVersion', () => {
  test('is the version in the package manifest', () => {
    const manifest = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8')) as { version: string }
    expect(appVersion).toBe(manifest.version)
  })
})

describe('databaseDirectoryFromUrl', () => {
  test('resolves a relative file URL against the working directory', () => {
    expect(databaseDirectoryFromUrl('file:./data/wash-cycle-tracker.db', '/app')).toBe('/app/data')
  })

  test('keeps an absolute file URL', () => {
    expect(databaseDirectoryFromUrl('file:/var/lib/wash-cycle-tracker/db.sqlite', '/app')).toBe('/var/lib/wash-cycle-tracker')
  })

  test('returns null for a missing, empty or non-file URL', () => {
    expect(databaseDirectoryFromUrl(undefined)).toBeNull()
    expect(databaseDirectoryFromUrl('')).toBeNull()
    expect(databaseDirectoryFromUrl('file:')).toBeNull()
    expect(databaseDirectoryFromUrl('postgres://localhost/db')).toBeNull()
  })
})

describe('checkDirectoryWritable', () => {
  test('reports a writable directory and leaves no file behind', async () => {
    const directory = makeTemporaryDirectory()
    await expect(checkDirectoryWritable(directory)).resolves.toEqual({ writable: true, directory })
    expect(readdirSync(directory)).toEqual([])
  })

  test('reports a directory that does not exist', async () => {
    const directory = join(makeTemporaryDirectory(), 'missing')
    const result = await checkDirectoryWritable(directory)
    expect(result.writable).toBe(false)
    expect(result).toMatchObject({ reason: expect.stringContaining('ENOENT') })
  })

  // The root user can write to a read-only directory, so this check is only meaningful otherwise.
  test.skipIf(process.getuid?.() === 0)('reports a read-only directory', async () => {
    const directory = makeTemporaryDirectory()
    chmodSync(directory, 0o555)
    const result = await checkDirectoryWritable(directory)
    expect(result.writable).toBe(false)
    expect(result).toMatchObject({ reason: expect.stringMatching(/EACCES|EPERM/) })
  })
})

describe('checkDatabaseDirectoryWritable', () => {
  test('checks the directory of DATABASE_URL', async () => {
    const directory = makeTemporaryDirectory()
    const result = await checkDatabaseDirectoryWritable({ DATABASE_URL: `file:${join(directory, 'app.db')}` })
    expect(result).toEqual({ writable: true, directory })
  })

  test('is not writable when DATABASE_URL is not set', async () => {
    const result = await checkDatabaseDirectoryWritable({})
    expect(result).toMatchObject({ writable: false, directory: null })
  })
})

describe('isPasswordSet', () => {
  test('is true when APP_PASSWORD has a value', () => {
    expect(isPasswordSet({ APP_PASSWORD: 'secret' })).toBe(true)
  })

  test('is false when APP_PASSWORD is missing or empty', () => {
    expect(isPasswordSet({})).toBe(false)
    expect(isPasswordSet({ APP_PASSWORD: '' })).toBe(false)
  })
})

describe('getHelpStatus', () => {
  test('never contains the password or the session secret', async () => {
    const directory = makeTemporaryDirectory()
    const status = await getHelpStatus({
      DATABASE_URL: `file:${join(directory, 'app.db')}`,
      APP_PASSWORD: 'hunter2-password',
      SESSION_SECRET: 'very-secret-session-key',
    })
    expect(status).toEqual({ version: appVersion, database: { writable: true, directory }, passwordSet: true })
    const serialized = JSON.stringify(status)
    expect(serialized).not.toContain('hunter2-password')
    expect(serialized).not.toContain('very-secret-session-key')
  })
})
