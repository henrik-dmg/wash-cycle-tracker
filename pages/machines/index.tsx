import { auth0 } from '../../lib/auth0'
import { fetchMachinesForUser } from '../../lib/machine.service'
import { Machine } from '../../lib/generated/prisma/client'
import type { NextPage } from 'next'
import Link from 'next/link'
import styles from '../../styles/Default.module.css'
import { highlightableItem } from '../../lib/style.utilities'

interface Props {
  user: any
  machines: [Machine]
}

const MachinesPage: NextPage<Props> = (props) => {
  return (
    <main className={styles.defaultContainer}>
      {props.machines.map((machine) => (
        <Link key={machine.id} href={`/machines/${machine.id}`} className={highlightableItem('p-2', 'rounded')}>
          <h2 className="text-3xl font-bold">{machine.name}</h2>
          <h4>{machine.id}</h4>
        </Link>
      ))}

      <div className="pt-12">
        <Link href="/machines/create" className={highlightableItem('p-2', 'rounded')}>
          Create a new machine
        </Link>
      </div>
    </main>
  )
}

export default MachinesPage

export const getServerSideProps = auth0.withPageAuthRequired({
  async getServerSideProps(context) {
    try {
      const session = await auth0.getSession(context.req)
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
