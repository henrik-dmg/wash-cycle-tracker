import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { deploymentMode } from '../../lib/deployment-mode'
import { hasValidSession, safeRedirectPath, signInEnabled } from '../../lib/sign-in'
import LoginForm from './LoginForm'

// See app/page.tsx: this route depends on runtime env variables, so it cannot be prerendered.
export const dynamic = 'force-dynamic'

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  if (deploymentMode !== 'deployment') {
    notFound()
  }

  const next = safeRedirectPath((await searchParams).next)
  if (!signInEnabled || hasValidSession(await cookies())) {
    redirect(next)
  }

  return <LoginForm next={next} />
}
