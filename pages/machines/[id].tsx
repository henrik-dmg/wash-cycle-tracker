import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import MachineComponent from '../../components/Machine'
import { fetchMachine } from '../../lib/machine.service'
import type { NextPage } from 'next'
import { Machine } from '@prisma/client'
import toast from 'react-hot-toast'

interface Props {
  user: any
  machine?: Machine
}

const MachinePage: NextPage<Props> = (props) => {
  return (
    <>
      {!props.machine && <p>Machine not found</p>}
      {props.machine && <MachineComponent machine={props.machine} />}
    </>
  )
}

export default MachinePage

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    try {
      const session = getSession(context.req, context.res)
      const { user } = session!
      const id = context.params!['id'] as string
      const machine = await fetchMachine(user.sub, parseInt(id))
      if (!machine) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }
      return { props: { machine: machine } }
    } catch (error) {
      console.error(error)
      throw error
    }
  },
})
