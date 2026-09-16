import { describe, expect, test } from 'vitest'
import { createSessionToken, isCorrectPassword, isValidSessionToken, resolveSignInConfig, safeRedirectPath, SESSION_MAX_AGE_SECONDS } from '../lib/sign-in'

const config = { password: 'secret password', sessionSecret: 'session secret' }

describe('sign-in config', () => {
  test('is not active when APP_PASSWORD is not set or empty', () => {
    expect(resolveSignInConfig({}, 'deployment')).toBeNull()
    expect(resolveSignInConfig({ APP_PASSWORD: '' }, 'deployment')).toBeNull()
  })

  test('is not active on the marketing site', () => {
    expect(resolveSignInConfig({ APP_PASSWORD: 'x', SESSION_SECRET: 'y' }, 'marketing')).toBeNull()
  })

  test('stops with a clear error when APP_PASSWORD is set without SESSION_SECRET', () => {
    expect(() => resolveSignInConfig({ APP_PASSWORD: 'x' }, 'deployment')).toThrow(/SESSION_SECRET must be set/)
  })

  test('is active when both are set', () => {
    expect(resolveSignInConfig({ APP_PASSWORD: 'x', SESSION_SECRET: 'y' }, 'deployment')).toEqual({ password: 'x', sessionSecret: 'y' })
  })
})

describe('password and session token', () => {
  test('checks the password', () => {
    expect(isCorrectPassword('secret password', config)).toBe(true)
    expect(isCorrectPassword('secret passwor', config)).toBe(false)
    expect(isCorrectPassword(undefined, config)).toBe(false)
    expect(isCorrectPassword('secret password', null)).toBe(false)
  })

  test('accepts a fresh token and refuses it after 30 days', () => {
    const now = Date.now()
    const token = createSessionToken(now, config)
    expect(isValidSessionToken(token, now, config)).toBe(true)
    expect(isValidSessionToken(token, now + SESSION_MAX_AGE_SECONDS * 1000 - 1, config)).toBe(true)
    expect(isValidSessionToken(token, now + SESSION_MAX_AGE_SECONDS * 1000, config)).toBe(false)
  })

  test('refuses a token with a changed expiry, another secret or another password', () => {
    const now = Date.now()
    const token = createSessionToken(now, config)
    const [expiresAt, signature] = token.split('.')
    expect(isValidSessionToken(`${Number(expiresAt) + 1000}.${signature}`, now, config)).toBe(false)
    expect(isValidSessionToken(token, now, { ...config, sessionSecret: 'other secret' })).toBe(false)
    expect(isValidSessionToken(token, now, { ...config, password: 'other password' })).toBe(false)
    expect(isValidSessionToken('garbage', now, config)).toBe(false)
    expect(isValidSessionToken(undefined, now, config)).toBe(false)
  })
})

describe('redirect after login', () => {
  test('keeps a same-origin path and refuses other sites', () => {
    expect(safeRedirectPath('/machines/3')).toBe('/machines/3')
    expect(safeRedirectPath('//evil.example')).toBe('/')
    expect(safeRedirectPath('/\\evil.example')).toBe('/')
    expect(safeRedirectPath('https://evil.example')).toBe('/')
    expect(safeRedirectPath(undefined)).toBe('/')
  })
})
