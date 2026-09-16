import { notFound } from 'next/navigation'
import { getMachine } from '../../../lib/machine.service'
import styles from '../../../styles/Default.module.css'
import MachineComponent from '../../../components/machine/MachineComponent'

export default async function MachinePage({ params }: PageProps<'/machines/[id]'>) {
  const { id: rawId } = await params
  const id = parseInt(rawId)
  const machine = id ? await getMachine(id) : null
  if (!machine) {
    notFound()
  }

  return (
    <main className={styles.defaultContainer}>
      <MachineComponent machine={machine} />
    </main>
  )
}
