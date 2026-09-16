import { redirect } from 'next/navigation'
import { fetchMachineDetails } from '../../../lib/machine.service'
import { requireSession } from '../../../lib/session.utilities'
import styles from '../../../styles/Default.module.css'
import MachineComponent from '../../../components/machine/MachineComponent'

export default async function MachinePage({ params }: PageProps<'/machines/[id]'>) {
  const { id: rawId } = await params
  const { user } = await requireSession(`/machines/${rawId}`)
  const id = parseInt(rawId)
  const machine = id ? await fetchMachineDetails(user.id, id) : null
  if (!machine) {
    redirect('/machines')
  }

  return (
    <main className={styles.defaultContainer}>
      <MachineComponent machine={machine} currentUserId={user.id} />
    </main>
  )
}
