import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextResponse, type NextRequest } from 'next/server'
import { auth } from './auth'

export type Session = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>
export type SessionUser = Session['user']

export type RouteHandlerWithSession<Context> = (request: NextRequest, context: Context, session: Session) => Promise<Response>

// Returns the session of the signed-in user, or sends the user to the login page and back to `returnTo`.
export async function requireSession(returnTo: string): Promise<Session> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`)
  }
  return session
}

export function withSessionEnsured<Context>(handler: RouteHandlerWithSession<Context>) {
  return async (request: NextRequest, context: Context) => {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }
    return handler(request, context, session)
  }
}
