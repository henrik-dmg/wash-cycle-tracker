import useSWR from 'swr'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import ProtectedRoute from '../../components/ProtectedRoute'

const fetcher = async (uri) => {
  const response = await fetch(uri)
  return response.json()
}

export default function Machines() {
  const { data, error } = useSWR('/api/machines', fetcher)

  if (error) return <ProtectedRoute error={`something went wrong`} />
  if (data === undefined) return <div>Loading...</div>
  return <div>{data.message}</div>
}

export const getServerSideProps = withPageAuthRequired()
