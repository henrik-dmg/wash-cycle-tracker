import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { createApiMachineStore } from '../lib/store/api-store'
import { createInProcessFetch } from './support/in-process-fetch'
import { setupTestDatabase } from './support/test-database'
import { runMachineStoreContract } from './machine-store.contract'

// The deployment is open: APP_PASSWORD is not set. Runs before the imports load, because the
// sign-in module reads the env variables once.
vi.hoisted(() => {
  delete process.env.APP_PASSWORD
  delete process.env.SESSION_SECRET
})

const originalFetch = globalThis.fetch

setupTestDatabase()

beforeAll(() => {
  globalThis.fetch = createInProcessFetch()
})

afterAll(() => {
  globalThis.fetch = originalFetch
})

describe('without APP_PASSWORD', () => {
  test('an API call without a cookie gets access', async () => {
    const response = await createInProcessFetch()('/api/machines')
    expect(response.status).toBe(200)
  })

  test('the sign-in is not active', async () => {
    const response = await createInProcessFetch()('/api/session', { method: 'POST', body: JSON.stringify({ password: 'anything' }) })
    expect(response.status).toBe(404)
  })
})

runMachineStoreContract(() => createApiMachineStore())
