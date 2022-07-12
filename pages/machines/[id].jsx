import { useRouter } from "next/router";
import Head from "next/head";

export default function Machine() {
  const router = useRouter()
  const { id } = router.query

  return (<>
    <Head>
      <title>Machine #{id}</title>
    </Head>
    <h1>Machine #{id}</h1>
  </>)
}