import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { fetchMachinesForUser } from '../../lib/machine.service'
import { Machine } from '@prisma/client'
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
        <Link key={machine.id} href={`/machines/${machine.id}`}>
          <a>
            <div key={machine.id} className={highlightableItem('p-2', 'rounded')}>
              <h2 className="text-3xl font-bold">{machine.name}</h2>
              <h4>{machine.id}</h4>
              <p>{machine.createdAt}</p>
            </div>
          </a>
        </Link>
      ))}

      <div className="pt-12">
        <Link href="/machines/create">
          <a className={highlightableItem('p-2', 'rounded')}>Create a new machine</a>
        </Link>
      </div>
    </main>
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
