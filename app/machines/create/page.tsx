import { notFound } from 'next/navigation'
import { deploymentMode } from '../../../lib/deployment-mode'
import CreateMachineForm from './CreateMachineForm'

// See app/page.tsx: this route's availability depends on the runtime deployment mode, so it
// cannot be prerendered at build time.
export const dynamic = 'force-dynamic'

export default function CreateMachinePage() {
  if (deploymentMode !== 'deployment') {
    notFound()
  }
  return <CreateMachineForm />
}
