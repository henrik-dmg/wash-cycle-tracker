import { NextResponse, type NextRequest } from 'next/server'
import { apiNotFoundOutsideDeploymentMode } from '../../../lib/api-guard'
import { createSessionToken, isCorrectPassword, SESSION_COOKIE_NAME, sessionCookieOptions, signInEnabled } from '../../../lib/sign-in'

// Signs in. The body is `{ "password": string }`. A correct password sets the session cookie.
export async function POST(request: NextRequest) {
  const guard = apiNotFoundOutsideDeploymentMode()
  if (guard) {
    return guard
  }
  if (!signInEnabled) {
    return NextResponse.json({ message: 'The sign-in is not active because APP_PASSWORD is not set' }, { status: 404 })
  }

  const body = await request.json().catch(() => ({}))
  if (!isCorrectPassword(body?.password)) {
    return NextResponse.json({ message: 'Wrong password. Try again.' }, { status: 401 })
  }

  const response = new NextResponse(null, { status: 204 })
  response.cookies.set(SESSION_COOKIE_NAME, createSessionToken(), sessionCookieOptions(request))
  return response
}

// Signs out by clearing the session cookie.
export async function DELETE(request: NextRequest) {
  const guard = apiNotFoundOutsideDeploymentMode()
  if (guard) {
    return guard
  }

  const response = new NextResponse(null, { status: 204 })
  response.cookies.set(SESSION_COOKIE_NAME, '', sessionCookieOptions(request, 0))
  return response
}
