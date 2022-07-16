import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import prisma from '../../lib/prisma'
import Machine from '../../components/Machine'
import safeJsonStringify from 'safe-json-stringify'

export default function MachinePage({ user, machine }) {
  return <Machine machine={machine} />
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    try {
      const { id } = context.params
      const machine = await prisma.machine.findUnique({ where: { id: parseInt(id) } })
      console.log('DATE', machine?.createdAt)
      machine.createdAt = JSON.parse(safeJsonStringify(machine?.createdAt))

      return { props: { machine: machine } }
    } catch (error) {
      console.error(error)
      throw error
    }
  },
})
