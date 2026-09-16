import { execFileSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { existsSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll } from 'vitest'

// Creates a temporary SQLite file with the migrations applied before the tests of the calling file,
// and deletes it after them.
export function setupTestDatabase() {
  const dbPath = join(tmpdir(), `wash-cycle-tracker-test-${randomUUID()}.db`)

  beforeAll(() => {
    process.env.DATABASE_URL = `file:${dbPath}`
    execFileSync('pnpm', ['exec', 'prisma', 'migrate', 'deploy', '--config', 'prisma.config.ts'], {
      cwd: process.cwd(),
      env: process.env,
      stdio: 'inherit',
    })
  })

  afterAll(() => {
    for (const suffix of ['', '-journal', '-wal', '-shm']) {
      if (existsSync(dbPath + suffix)) {
        rmSync(dbPath + suffix)
      }
    }
  })
}
