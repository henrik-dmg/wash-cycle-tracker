import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import prisma from '../../lib/prisma'
import Machine from '../../components/Machine'

export default function MachinesPage({ user, machines }) {
  return machines.map((machine) => <Machine key={machine.id} machine={machine} />)
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const machines = await prisma.machine.findMany()
    console.log('Fetched machines from DB')
    return { props: { machines: machines } }
  },
})
