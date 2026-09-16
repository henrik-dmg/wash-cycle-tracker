import { requireSession } from '../../../lib/session.utilities'
import CreateMachineForm from './CreateMachineForm'

export default async function CreateMachinePage() {
  await requireSession('/machines/create')
  return <CreateMachineForm />
}
