import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Machine from '../../components/Machine'
import { fetchMachine } from '../../lib/machine.service'

export default function MachinePage({ user, machine }) {
  return <Machine machine={machine} />
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    try {
      const { id } = context.params
      const machine = await fetchMachine(parseInt(id))
      return { props: { machine: machine } }
    } catch (error) {
      console.error(error)
      throw error
    }
  },
})
