import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import Image from 'next/image'
import styles from '../../styles/Default.module.css'

export default function AccountPage() {
  const { user, error, isLoading } = useUser()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  return (
    user && (
      <main className={styles.defaultContainer}>
        <div>
          <h1>Account</h1>
          <p>This is the account page.</p>
          <Image src={user.picture} alt={user.name} width={100} height={100} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      </main>
    )
  )
}

export const getServerSideProps = withPageAuthRequired()
