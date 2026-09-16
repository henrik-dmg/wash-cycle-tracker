import { NextResponse, type NextRequest } from 'next/server'
import { hasValidSession, signInEnabled } from './lib/sign-in'

// Pages that stay reachable without a session. API routes check the session in their own guard
// (see lib/api-guard.ts) and answer 401 instead of a redirect.
function isPublicPath(pathname: string): boolean {
  return pathname === '/login' || pathname === '/help' || pathname.startsWith('/help/') || pathname.startsWith('/api/')
}

// Redirects a page request without a valid session to the login page when APP_PASSWORD is set.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  if (!signInEnabled || isPublicPath(pathname) || hasValidSession(request.cookies)) {
    return NextResponse.next()
  }

  const loginUrl = new URL('/login', request.url)
  if (pathname !== '/') {
    loginUrl.searchParams.set('next', `${pathname}${search}`)
  }
  return NextResponse.redirect(loginUrl)
}

export const config = {
  // Skip static files and images, so the login page can load its CSS and JS.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
}
