import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { deploymentMode } from '../../lib/deployment-mode'
import DemoMachineStoreProvider from '../../components/demo/DemoMachineStoreProvider'

// See app/page.tsx: the demo exists only in marketing mode, which is chosen at container start.
export const dynamic = 'force-dynamic'

// The demo is part of the marketing site, so it opts in to indexing, unlike the root layout's
// default. See app/page.tsx for the same pattern on the marketing home page.
export const metadata: Metadata = {
  title: 'Demo · Wash Cycle Tracker',
  description: 'Try the Wash Cycle Tracker screens with sample data. Your changes stay in your browser only.',
  alternates: { canonical: '/demo' },
  robots: { index: true, follow: true },
}

// The demo is the tracker screens with the localStorage store. Nothing below this layout imports
// the database module or calls the HTTP API.
export default function DemoLayout({ children }: { children: ReactNode }) {
  if (deploymentMode !== 'marketing') {
    notFound()
  }
  return <DemoMachineStoreProvider>{children}</DemoMachineStoreProvider>
}
