import { useUser } from '@auth0/nextjs-auth0'
import Image from 'next/image'
import Link from 'next/link'
import Loader from './Loader'
import styles from './navigationbar.module.css'

export default function NavigationBar() {
  const { user, isLoading } = useUser()

  function getUserID() {
    return user.sub.split('|')[1]
  }
  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <Link href="/">
            <a className="btn-logo">FEED</a>
          </Link>
        </li>

        {!user && (
          <li className="push-left">
            <a href="/api/auth/login">Login</a>
          </li>
        )}
        {user && (
          <>
            <li className="push-left">
              <Link href={`/${getUserID()}`}>
                <Image src={user.picture} alt={user.name} width={100} height={100} />
              </Link>
            </li>
            <li>
              <a href="/api/auth/logout">Logout</a>
            </li>
          </>
        )}

        {isLoading && (
          <li>
            <Loader isShown />
          </li>
        )}
      </ul>
    </nav>
  )
}
