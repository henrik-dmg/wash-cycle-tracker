'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import styles from './navigationbar.module.css'
import { highlightableItem } from '../../lib/style.utilities'

const NavigationBar = () => {
  const pathname = usePathname()
  const [active, setActive] = useState(false)
  const { user } = useUser()

  const handleClick = () => {
    setActive(!active)
  }

  const isCurrent = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        <Link href="/" className="inline-flex items-center gap-2 mr-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
            W
          </span>
          <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">WMS</span>
        </Link>
        <button className={highlightableItem(styles.navbarHamburgerButton)} onClick={handleClick}>
          {active ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
        <div className={`${active ? '' : 'hidden'} w-full lg:inline-flex lg:flex-grow lg:w-auto`}>
          <div className="lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start flex flex-col lg:h-auto gap-1 py-2 lg:py-0">
            <Link
              href="/machines"
              className={`${styles.navbarItem} ${isCurrent('/machines') ? styles.navbarItemActive : ''}`}
              onClick={handleClick}
            >
              Machines
            </Link>
            <Link
              href="/#pricing"
              className={`${styles.navbarItem} ${isCurrent('/pricing') ? styles.navbarItemActive : ''}`}
              onClick={handleClick}
            >
              Pricing
            </Link>
            {!user && (
              <a href="/auth/login" className={`${styles.navbarItem} ${styles.navbarItemCta}`} onClick={handleClick}>
                Log in
              </a>
            )}
            {user && (
              <>
                <Link
                  href="/account"
                  className={`${styles.navbarItem} ${isCurrent('/account') ? styles.navbarItemActive : ''}`}
                  onClick={handleClick}
                >
                  Account
                </Link>
                <a href="/auth/logout" className={styles.navbarItem} onClick={handleClick}>
                  Log out
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavigationBar
