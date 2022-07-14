import { useRouter } from 'next/router'
import Head from 'next/head'
import type { NextPage } from 'next'
import Link from 'next/link'
import Layout from '../../components/layout'

const Machine: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const machineName = `Machine ${id}`

  return (
    <Layout home={false}>
      <Head>
        <title>{machineName}</title>
      </Head>
      <h1 className="title">{machineName}</h1>
      <Link href="/machines/create">
        <a>Create new machine</a>
      </Link>
    </Layout>
  )
}

export default Machine
