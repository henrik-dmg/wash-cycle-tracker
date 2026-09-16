import { NextResponse, type NextRequest } from 'next/server'
import { deploymentMode } from './deployment-mode'
import { hasValidSession } from './sign-in'

// Route handlers call a guard before importing anything from `machine.service`, so the database
// module is never loaded when the app runs outside deployment mode.
export function apiNotFoundOutsideDeploymentMode(): NextResponse | null {
  if (deploymentMode === 'deployment') {
    return null
  }
  return NextResponse.json({ message: 'Not found' }, { status: 404 })
}

// The guard for every tracker API route: 404 outside deployment mode, and 401 when APP_PASSWORD is
// set and the request has no valid session.
export function guardApiRequest(request: NextRequest): NextResponse | null {
  const notFound = apiNotFoundOutsideDeploymentMode()
  if (notFound) {
    return notFound
  }
  if (!hasValidSession(request.cookies)) {
    return NextResponse.json({ message: 'Sign in to use the API' }, { status: 401 })
  }
  return null
}
