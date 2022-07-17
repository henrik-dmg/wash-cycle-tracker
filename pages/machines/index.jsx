import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Machine from '../../components/Machine'
import { fetchMachines } from '../../lib/machine.service'

export default function MachinesPage({ user, machines }) {
  return machines.map((machine) => <Machine key={machine.id} machine={machine} />)
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    try {
      const machines = await fetchMachines()
      return { props: { machines: machines } }
    } catch (error) {
      console.error(error)
      throw error
    }
  },
})
