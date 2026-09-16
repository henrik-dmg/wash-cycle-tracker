import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { deploymentMode } from '../../lib/deployment-mode'
import DemoMachineStoreProvider from '../../components/demo/DemoMachineStoreProvider'

// See app/page.tsx: the demo exists only in marketing mode, which is chosen at container start.
export const dynamic = 'force-dynamic'

// The demo is the tracker screens with the localStorage store. Nothing below this layout imports
// the database module or calls the HTTP API.
export default function DemoLayout({ children }: { children: ReactNode }) {
  if (deploymentMode !== 'marketing') {
    notFound()
  }
  return <DemoMachineStoreProvider>{children}</DemoMachineStoreProvider>
}
