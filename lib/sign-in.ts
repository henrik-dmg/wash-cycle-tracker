import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { deploymentMode, type DeploymentMode } from './deployment-mode'

export const SESSION_COOKIE_NAME = 'wms_session'
export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60

export interface SignInConfig {
  password: string
  sessionSecret: string
}

// Returns the sign-in config, or null when the sign-in is not active. The sign-in is active only
// in deployment mode and only when APP_PASSWORD is set to a non-empty value.
export function resolveSignInConfig(env: Record<string, string | undefined>, mode: DeploymentMode): SignInConfig | null {
  if (mode !== 'deployment') {
    return null
  }
  const password = env.APP_PASSWORD
  if (!password) {
    return null
  }
  const sessionSecret = env.SESSION_SECRET
  if (!sessionSecret) {
    throw new Error('SESSION_SECRET must be set when APP_PASSWORD is set. Set SESSION_SECRET to a long random value, for example the output of `openssl rand -base64 32`.')
  }
  return { password, sessionSecret }
}

// Reads APP_PASSWORD and SESSION_SECRET once, when this module first loads. Pages, route handlers
// and the proxy use this module and never read the env variables directly.
const signInConfig = resolveSignInConfig(process.env, deploymentMode)

export const signInEnabled = signInConfig !== null

function sha256(value: string): Buffer {
  return createHash('sha256').update(value).digest()
}

// Compares in constant time. Hashing both sides first gives equal-length buffers, so the time does
// not reveal the length of the password either.
function constantTimeEqual(a: string, b: string): boolean {
  return timingSafeEqual(sha256(a), sha256(b))
}

export function isCorrectPassword(candidate: unknown, config: SignInConfig | null = signInConfig): boolean {
  if (!config || typeof candidate !== 'string') {
    return false
  }
  return constantTimeEqual(candidate, config.password)
}

// The signature covers the expiry time and a hash of the password, so a changed password or a
// changed secret signs out every device.
function sign(expiresAt: number, config: SignInConfig): string {
  const passwordHash = sha256(config.password).toString('base64url')
  return createHmac('sha256', config.sessionSecret).update(`session:v1:${expiresAt}:${passwordHash}`).digest('base64url')
}

// A session token is `<expiry in ms>.<signature>`. No session is stored on the server.
export function createSessionToken(now: number = Date.now(), config: SignInConfig | null = signInConfig): string {
  if (!config) {
    throw new Error('The sign-in is not active')
  }
  const expiresAt = now + SESSION_MAX_AGE_SECONDS * 1000
  return `${expiresAt}.${sign(expiresAt, config)}`
}

export function isValidSessionToken(token: string | undefined, now: number = Date.now(), config: SignInConfig | null = signInConfig): boolean {
  if (!config || !token) {
    return false
  }
  const [rawExpiresAt, signature, ...rest] = token.split('.')
  if (rest.length > 0 || !rawExpiresAt || !signature || !/^\d+$/.test(rawExpiresAt)) {
    return false
  }
  const expiresAt = Number(rawExpiresAt)
  if (expiresAt <= now) {
    return false
  }
  return constantTimeEqual(signature, sign(expiresAt, config))
}

interface CookieReader {
  get(name: string): { value: string } | undefined
}

// True when the request may use the tracker: the sign-in is not active, or the cookie holds a valid session.
export function hasValidSession(cookies: CookieReader): boolean {
  if (!signInEnabled) {
    return true
  }
  return isValidSessionToken(cookies.get(SESSION_COOKIE_NAME)?.value)
}

// The cookie is Secure when the request comes over HTTPS, directly or through a reverse proxy
// that sets X-Forwarded-Proto.
export function sessionCookieOptions(request: Request, maxAge: number = SESSION_MAX_AGE_SECONDS) {
  const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim()
  const secure = forwardedProto ? forwardedProto === 'https' : new URL(request.url).protocol === 'https:'
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure,
    path: '/',
    maxAge,
  }
}

// Returns a same-origin path to go to after the login, so the `next` parameter cannot redirect to another site.
export function safeRedirectPath(value: unknown): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) {
    return '/'
  }
  return value
}
