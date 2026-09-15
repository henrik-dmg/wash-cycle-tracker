import { auth0 } from '../../lib/auth0'
import { fetchMachine, MachineWithActions } from '../../lib/machine.service'
import type { NextPage } from 'next'
import { Machine, Action } from '../../lib/generated/prisma/client'
import styles from '../../styles/Default.module.css'
import React from 'react'
import MachineComponent from '../../components/machine/MachineComponent'

interface Props {
  machine?: MachineWithActions
}

const MachinePage: NextPage<Props> = (props) => {
  return (
    <main className={styles.defaultContainer}>
      {!props.machine && <p>Machine not found</p>}
      {props.machine && <MachineComponent machine={props.machine} />}
    </main>
  )
}

export default MachinePage

export const getServerSideProps = auth0.withPageAuthRequired({
  async getServerSideProps(context) {
    try {
      const session = await auth0.getSession(context.req)
      const { user } = session!
      const id = parseInt(context.params!['id'] as string)
      if (!id) {
        throw `Id was ${id} on dynamic route`
      }
      console.log(`Fetching machine for id ${id}`)
      const machine = await fetchMachine(user.sub, id)
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
