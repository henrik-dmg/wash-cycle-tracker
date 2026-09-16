import { NextResponse } from 'next/server'
import { deploymentMode } from './deployment-mode'

// Route handlers call this before importing anything from `machine.service`, so the database
// module is never loaded when the app runs outside deployment mode.
export function apiNotFoundOutsideDeploymentMode(): NextResponse | null {
  if (deploymentMode === 'deployment') {
    return null
  }
  return NextResponse.json({ message: 'Not found' }, { status: 404 })
}
