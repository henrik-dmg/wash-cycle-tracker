import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import MachineComponent from '../../components/MachineComponent'
import { fetchMachinesForUser } from '../../lib/machine.service'
import { Machine } from '@prisma/client'
import type { NextPage } from 'next'
import Link from 'next/link'

interface Props {
  user: any
  machines: [Machine]
}

const MachinesPage: NextPage<Props> = (props) => {
  return (
    <>
      {props.machines.map((machine) => (
        <MachineComponent key={machine.id} machine={machine} />
      ))}
      <Link href="/machines/create">
        <a>Create a new machine</a>
      </Link>
    </>
  )
}

export default MachinesPage

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    try {
      const session = getSession(context.req, context.res)
      if (!session) {
        throw "User session doesn't exist"
      }
      const { user } = session
      const machines = await fetchMachinesForUser(user.sub)
      return { props: { machines: machines } }
    } catch (error) {
      console.error(error)
      throw error
    }
  },
})
