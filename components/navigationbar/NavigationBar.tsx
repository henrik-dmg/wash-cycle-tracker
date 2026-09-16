'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import styles from './navigationbar.module.css'
import { highlightableItem } from '../../lib/style.utilities'
import type { DeploymentMode } from '../../lib/deployment-mode'
import { sendJson } from '../../lib/fetch.utilities'

const GITHUB_URL = 'https://github.com/henrik-dmg/washing-machine-server'

const NavigationBar = ({ mode, signInEnabled }: { mode: DeploymentMode; signInEnabled: boolean }) => {
  const pathname = usePathname()
  const router = useRouter()
  const [active, setActive] = useState(false)

  const handleClick = () => {
    setActive(!active)
  }

  const handleSignOut = async () => {
    await sendJson<void>('/api/session', 'DELETE').catch(() => undefined)
    router.replace('/login')
    router.refresh()
  }

  const isMachinesCurrent = pathname === '/' || pathname.startsWith('/machines')

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
            {mode === 'deployment' ? (
              <>
                <Link href="/" className={`${styles.navbarItem} ${isMachinesCurrent ? styles.navbarItemActive : ''}`} onClick={handleClick}>
                  Machines
                </Link>
                {signInEnabled && pathname !== '/login' && (
                  <button type="button" className={`${styles.navbarItem} cursor-pointer text-left`} onClick={handleSignOut}>
                    Sign out
                  </button>
                )}
              </>
            ) : (
              <>
                <Link href="/demo" className={styles.navbarItem} onClick={handleClick}>
                  Demo
                </Link>
                <Link href="/#compose-form" className={styles.navbarItem} onClick={handleClick}>
                  Compose form
                </Link>
                <a href={GITHUB_URL} target="_blank" rel="noreferrer" className={styles.navbarItem} onClick={handleClick}>
                  GitHub
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
