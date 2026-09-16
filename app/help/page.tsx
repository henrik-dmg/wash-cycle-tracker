import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { deploymentMode } from '../../lib/deployment-mode'
import HelpPage from '../../components/help/HelpPage'

// See app/page.tsx: this route's availability depends on the runtime deployment mode, and the
// status block must reflect the running container, so it cannot be prerendered at build time.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Help · Wash Cycle Tracker',
}

export default async function HelpRoute() {
  if (deploymentMode !== 'deployment') {
    notFound()
  }

  const { getHelpStatus } = await import('../../lib/help-status')
  const status = await getHelpStatus()
  return <HelpPage status={status} />
}
