import { execFileSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { existsSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll } from 'vitest'
import { createApiMachineStore } from '../lib/store/api-store'
import { createInProcessFetch } from './support/in-process-fetch'
import { runMachineStoreContract } from './machine-store.contract'

const dbPath = join(tmpdir(), `washing-machine-test-${randomUUID()}.db`)
const originalFetch = globalThis.fetch

beforeAll(() => {
  process.env.DATABASE_URL = `file:${dbPath}`
  execFileSync('pnpm', ['exec', 'prisma', 'migrate', 'deploy', '--config', 'prisma.config.ts'], {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
  })
  globalThis.fetch = createInProcessFetch()
})

afterAll(() => {
  globalThis.fetch = originalFetch
  for (const suffix of ['', '-journal', '-wal', '-shm']) {
    if (existsSync(dbPath + suffix)) {
      rmSync(dbPath + suffix)
    }
  }
})

runMachineStoreContract(() => createApiMachineStore())
