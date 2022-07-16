import { useRouter } from 'next/router'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import useSWR from 'swr'
import ProtectedRoute from '../../components/ProtectedRoute'

const fetcher = async (uri) => {
  const response = await fetch(uri)
  console.log(response)
  return response.json()
}

export default function Machine() {
  const router = useRouter()
  const { id } = router.query

  const { data, error } = useSWR(`/api/machines/${id}`, fetcher)

  if (error) return <ProtectedRoute error={`something went wrong`} />
  if (data === undefined) return <div>Loading...</div>
  return <div>{data.message}</div>
}

export const getServerSideProps = withPageAuthRequired()
