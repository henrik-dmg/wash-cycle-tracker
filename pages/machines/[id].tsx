import { useRouter } from "next/router";
import Head from "next/head";
import type { NextPage } from "next";
import Link from "next/link";

const Machine: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const machineName = `Machine ${id}`

  return (<>
    <Head>
      <title>{machineName}</title>
    </Head>
    <h1 className="title">{machineName}</h1>
    <Link href="/machines/create">
      <a>Create new machine</a>
    </Link>
  </>)
}

export default Machine