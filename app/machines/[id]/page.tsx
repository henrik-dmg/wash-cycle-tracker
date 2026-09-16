import { notFound } from 'next/navigation'
import { deploymentMode } from '../../../lib/deployment-mode'
import styles from '../../../styles/Default.module.css'
import MachineComponent from '../../../components/machine/MachineComponent'

export default async function MachinePage({ params }: PageProps<'/machines/[id]'>) {
  if (deploymentMode !== 'deployment') {
    notFound()
  }

  const { id: rawId } = await params
  const id = parseInt(rawId)
  const { getMachine } = await import('../../../lib/machine.service')
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
