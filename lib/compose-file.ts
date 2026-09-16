// Pure builder for the `docker-compose.yml` that the Compose form on the marketing site offers.
// No framework or browser import, so tests can call it directly.

// The published image on the major version tag, so `docker compose pull` gets minor and patch
// updates but never a breaking release.
export const COMPOSE_IMAGE = 'ghcr.io/henrik-dmg/wash-cycle-tracker:2'

// The port and the data directory inside the container. They match the Dockerfile.
export const CONTAINER_PORT = 3000
export const CONTAINER_DATA_DIRECTORY = '/app/data'
// Relative to the working directory of the container (`/app`), so the file is in the volume.
export const COMPOSE_DATABASE_URL = 'file:./data/wash-cycle-tracker.db'

export const DEFAULT_HOST_PORT = 3000

export interface ComposeFileOptions {
  hostPort: number
  // The optional password. An empty or missing value leaves the deployment open, and the file
  // then contains neither `APP_PASSWORD` nor `SESSION_SECRET`.
  password?: string
  // Signs the session cookie. Required when a password is set.
  sessionSecret?: string
}

export function isValidHostPort(port: number): boolean {
  return Number.isInteger(port) && port >= 1 && port <= 65535
}

// Builds the Compose YAML. Throws when the port is invalid, or when a password is set without a
// session secret.
export function buildComposeFile({ hostPort, password, sessionSecret }: ComposeFileOptions): string {
  if (!isValidHostPort(hostPort)) {
    throw new Error(`The host port must be a whole number from 1 to 65535, but got ${hostPort}`)
  }

  const environment: [string, string][] = [['DATABASE_URL', COMPOSE_DATABASE_URL]]
  if (password) {
    if (!sessionSecret) {
      throw new Error('A session secret is required when a password is set')
    }
    environment.push(['APP_PASSWORD', password], ['SESSION_SECRET', sessionSecret])
  }

  const lines = [
    'services:',
    '  app:',
    `    image: ${quote(COMPOSE_IMAGE)}`,
    '    restart: unless-stopped',
    '    ports:',
    `      - ${quote(`${hostPort}:${CONTAINER_PORT}`)}`,
    '    environment:',
    ...environment.map(([name, value]) => `      ${name}: ${quote(escapeComposeInterpolation(value))}`),
    '    volumes:',
    `      - ${quote(`db-data:${CONTAINER_DATA_DIRECTORY}`)}`,
    '',
    'volumes:',
    '  db-data:',
    '',
  ]
  return lines.join('\n')
}

// Makes a random session secret: 32 bytes from the Web Crypto API, as 64 hex characters. Runs in
// the browser, so the secret never goes to a server.
export function generateSessionSecret(crypto: Pick<Crypto, 'getRandomValues'> = globalThis.crypto): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

// Docker Compose replaces `$NAME` and `${NAME}` in values with env variables. `$$` is a literal `$`.
function escapeComposeInterpolation(value: string): string {
  return value.replaceAll('$', '$$$$')
}

// Writes a YAML double-quoted scalar. Inside double quotes only `\` and `"` are special, and
// escapes cover every character that YAML does not allow as printable text (control characters,
// line breaks, DEL, C1 controls, lone surrogates and BOM), so any string gives valid YAML that parses back
// to the same string.
function quote(value: string): string {
  let result = '"'
  for (let index = 0; index < value.length; index++) {
    const char = value[index]
    const code = value.charCodeAt(index)

    if (char === '\\' || char === '"') {
      result += `\\${char}`
    } else if (code >= 0xd800 && code <= 0xdbff && isLowSurrogate(value.charCodeAt(index + 1))) {
      // A valid surrogate pair is one printable character.
      result += char + value[index + 1]
      index++
    } else if (isPrintable(code)) {
      result += char
    } else {
      result += `\\u${code.toString(16).padStart(4, '0')}`
    }
  }
  return `${result}"`
}

function isLowSurrogate(code: number): boolean {
  return code >= 0xdc00 && code <= 0xdfff
}

// The YAML printable set, without tab and every character that some parsers read as a line break
// (NEL, line separator, paragraph separator), so the scalar always stays on one line.
function isPrintable(code: number): boolean {
  return (
    (code >= 0x20 && code <= 0x7e) ||
    (code >= 0xa0 && code <= 0xd7ff && code !== 0x2028 && code !== 0x2029) ||
    (code >= 0xe000 && code <= 0xfffd && code !== 0xfeff)
  )
}
