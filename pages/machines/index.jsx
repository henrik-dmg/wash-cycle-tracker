import useSWR from 'swr'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import ProtectedRoute from '../../components/ProtectedRoute'

const fetcher = (...args) => fetch(...args).then((response) => response.json())

export default function Machines() {
  const { data, error } = useSWR('/api/machines', fetcher)

  if (error) return <h1>this is an error: {error}</h1>

  return data ? (
    data.machines.map((machine) => (
      <div key={machine.id}>
        <h1>{machine.name}</h1>
        <h4>{machine.id}</h4>
      </div>
    ))
  ) : (
    <h1>loading...</h1>
  )
}

export const getServerSideProps = withPageAuthRequired()
