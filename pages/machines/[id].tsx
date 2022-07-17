import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import MachineComponent from '../../components/Machine'
import { fetchMachine } from '../../lib/machine.service'
import type { NextPage } from 'next'
import { Machine } from '@prisma/client'

interface Props {
  user: any
  machine: Machine
}

const MachinePage: NextPage<Props> = (props) => {
  return <MachineComponent machine={props.machine} />
}

export default MachinePage

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    try {
      if (!context.params) {
        throw 'Parameters were nil, even for dynamic route'
      }
      const id = context.params['id'] as string
      const machine = await fetchMachine(parseInt(id))
      return { props: { machine: machine } }
    } catch (error) {
      console.error(error)
      throw error
    }
  },
})
