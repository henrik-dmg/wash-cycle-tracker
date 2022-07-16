import { useRouter } from 'next/router'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import prisma from '../../lib/prisma'

export default function Machine({ user, machine }) {
  return (
    <div>
      <p>Hello</p>
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const { id } = context.params
    const machine = await prisma.machine.findUnique({ where: { id: parseInt(id) } })
    console.log('Fetched machine from DB')
    return { props: { machine: machine } }
  },
})
