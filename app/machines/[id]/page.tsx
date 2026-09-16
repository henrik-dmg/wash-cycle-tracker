import { redirect } from 'next/navigation'
import { fetchMachine } from '../../../lib/machine.service'
import { requireSession } from '../../../lib/session.utilities'
import styles from '../../../styles/Default.module.css'
import MachineComponent from '../../../components/machine/MachineComponent'

interface Props {
  params: Promise<{ id: string }>
}

export default async function MachinePage({ params }: Props) {
  const { id: rawId } = await params
  const { user } = await requireSession(`/machines/${rawId}`)
  const id = parseInt(rawId)
  const machine = id ? await fetchMachine(user.sub, id) : null
  if (!machine) {
    redirect('/')
  }

  return (
    <main className={styles.defaultContainer}>
      <MachineComponent machine={machine} />
    </main>
  )
}
