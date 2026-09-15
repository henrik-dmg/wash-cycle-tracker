import Link from 'next/link'
import { useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import styles from './navigationbar.module.css'
import { highlightableItem } from '../../lib/style.utilities'

interface Props {
  path: string
}

const NavigationBar = (props: Props) => {
  const [active, setActive] = useState(false)
  const { user, isLoading, error } = useUser()

  const handleClick = () => {
    setActive(!active)
  }

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbarContent}>
          <Link href="/" className="inline-flex items-center mr-4">
            <span className="text-xl text-black dark:text-white font-bold uppercase tracking-wide">WMS</span>
          </Link>
          <button className={highlightableItem(styles.navbarHamburgerButton)} onClick={handleClick}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {/*Note that in this div we will use a ternary operator to decide whether or not to display the content of the div  */}
          <div className={`${active ? '' : 'hidden'}   w-full lg:inline-flex lg:flex-grow lg:w-auto`}>
            <div className="lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start  flex flex-col lg:h-auto">
              <Link href="/machines" className={highlightableItem(styles.navbarItem)} onClick={handleClick}>
                Machines
              </Link>
              <Link href="/" className={highlightableItem(styles.navbarItem)} onClick={handleClick}>
                Contact us
              </Link>
              {!user && (
                <>
                  <a href="/auth/login" className={highlightableItem(styles.navbarItem)} onClick={handleClick}>
                    Log in
                  </a>
                </>
              )}
              {user && (
                <>
                  <Link href="/account" className={highlightableItem(styles.navbarItem)} onClick={handleClick}>
                    Account
                  </Link>
                  <a href="/auth/logout" className={highlightableItem(styles.navbarItem)} onClick={handleClick}>
                    Log out
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default NavigationBar
