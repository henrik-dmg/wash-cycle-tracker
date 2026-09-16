import { redirect } from 'next/navigation'
import { NextResponse, type NextRequest } from 'next/server'
import type { SessionData } from '@auth0/nextjs-auth0/types'
import { auth0 } from './auth0'

export type RouteHandlerWithSession<Context> = (request: NextRequest, context: Context, session: SessionData) => Promise<Response>

// Returns the session of the signed-in user, or sends the user to the login page and back to `returnTo`.
export async function requireSession(returnTo: string): Promise<SessionData> {
  const session = await auth0.getSession()
  if (!session) {
    redirect(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`)
  }
  return session
}

export function withSessionEnsured<Context>(handler: RouteHandlerWithSession<Context>) {
  return async (request: NextRequest, context: Context) => {
    const session = await auth0.getSession()
    if (!session) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }
    return handler(request, context, session)
  }
}
