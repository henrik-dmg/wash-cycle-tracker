import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { createApiMachineStore } from '../lib/store/api-store'
import { createInProcessFetch } from './support/in-process-fetch'
import { setupTestDatabase } from './support/test-database'
import { runMachineStoreContract } from './machine-store.contract'

// Runs before the imports load, because the sign-in module reads the env variables once.
const { PASSWORD } = vi.hoisted(() => {
  const password = 'correct "horse": battery # staple'
  process.env.APP_PASSWORD = password
  process.env.SESSION_SECRET = 'test-session-secret-that-is-long-enough'
  return { PASSWORD: password }
})

const originalFetch = globalThis.fetch

function logIn(fetchFunction: typeof fetch, password: string, headers: Record<string, string> = {}) {
  return fetchFunction('/api/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ password }),
  })
}

setupTestDatabase()

// The contract suite below runs with a signed-in fetch.
beforeAll(async () => {
  globalThis.fetch = createInProcessFetch()
  const response = await logIn(globalThis.fetch, PASSWORD)
  expect(response.status).toBe(204)
})

afterAll(() => {
  globalThis.fetch = originalFetch
})

describe('with APP_PASSWORD', () => {
  test('an API call without a cookie gets 401', async () => {
    const anonymousFetch = createInProcessFetch()
    expect((await anonymousFetch('/api/machines')).status).toBe(401)
    expect((await anonymousFetch('/api/machines', { method: 'POST', body: JSON.stringify({ name: 'Nope' }) })).status).toBe(401)
    expect((await anonymousFetch('/api/machines/1', { method: 'DELETE' })).status).toBe(401)
    expect((await anonymousFetch('/api/machines/1/entries', { method: 'POST', body: JSON.stringify({ kind: 'wash' }) })).status).toBe(401)
  })

  test('the API store fails without a session', async () => {
    const signedInFetch = globalThis.fetch
    globalThis.fetch = createInProcessFetch()
    try {
      await expect(createApiMachineStore().listMachines()).rejects.toMatchObject({ status: 401 })
    } finally {
      globalThis.fetch = signedInFetch
    }
  })

  test('an API call with a forged cookie gets 401', async () => {
    const forgedToken = `${Date.now() + 1_000_000}.not-a-real-signature`
    const response = await createInProcessFetch()('/api/machines', { headers: { cookie: `wct_session=${forgedToken}` } })
    expect(response.status).toBe(401)
  })

  test('a wrong password is refused and gives no access', async () => {
    const wrongFetch = createInProcessFetch()
    const response = await logIn(wrongFetch, 'wrong password')
    expect(response.status).toBe(401)
    expect((await response.json()).message).toMatch(/wrong password/i)
    expect(response.headers.getSetCookie()).toEqual([])
    expect((await wrongFetch('/api/machines')).status).toBe(401)
  })

  test('a correct login gives access with a signed, HTTP-only, SameSite=Lax cookie for 30 days', async () => {
    const userFetch = createInProcessFetch()
    const response = await logIn(userFetch, PASSWORD)
    expect(response.status).toBe(204)

    const [cookie] = response.headers.getSetCookie()
    expect(cookie).toMatch(/^wct_session=\d+\.[\w-]+;/)
    expect(cookie).toMatch(/HttpOnly/i)
    expect(cookie).toMatch(/SameSite=Lax/i)
    expect(cookie).toMatch(/Max-Age=2592000/i)
    expect(cookie).not.toMatch(/Secure/i)

    expect((await userFetch('/api/machines')).status).toBe(200)
  })

  test('the cookie is Secure when the request comes over HTTPS', async () => {
    const response = await logIn(createInProcessFetch(), PASSWORD, { 'X-Forwarded-Proto': 'https' })
    expect(response.headers.getSetCookie()[0]).toMatch(/Secure/i)
  })

  test('sign out clears the cookie', async () => {
    const userFetch = createInProcessFetch()
    await logIn(userFetch, PASSWORD)
    expect((await userFetch('/api/machines')).status).toBe(200)

    const response = await userFetch('/api/session', { method: 'DELETE' })
    expect(response.status).toBe(204)
    expect(response.headers.getSetCookie()[0]).toMatch(/Max-Age=0/i)
    expect((await userFetch('/api/machines')).status).toBe(401)
  })
})

runMachineStoreContract(() => createApiMachineStore())
