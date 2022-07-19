import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { fetchMachine } from '../../lib/machine.service'
import type { NextPage } from 'next'
import { Machine } from '@prisma/client'
import styles from "../../styles/Default.module.css"
import React from 'react'
import MachineComponent from '../../components/machine/MachineComponent'

interface Props {
  user: any
  machine?: Machine
}

const MachinePage: NextPage<Props> = (props) => {
  return (
    <main className={styles.defaultContainer}>
      {!props.machine && <p>Machine not found</p>}
      {props.machine && <MachineComponent machine={props.machine}/>}
    </main>
  )
}

export default MachinePage

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    try {
      const session = getSession(context.req, context.res)
      const { user } = session!
      const id = parseInt(context.params!['id'] as string)
      if (!id) {
        console.warn(`Id was ${id} on dynamic route`)
        return { props: { machine: undefined } }
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
