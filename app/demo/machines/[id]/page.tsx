import { notFound } from 'next/navigation'
import StoreMachinePage from '../../../../components/tracker/StoreMachinePage'

export default async function DemoMachinePage({ params }: PageProps<'/demo/machines/[id]'>) {
  const { id: rawId } = await params
  const id = Number(rawId)
  if (!Number.isInteger(id) || id <= 0) {
    notFound()
  }
  return <StoreMachinePage machineId={id} />
}
