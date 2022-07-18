import Link from 'next/link'
import { useState } from 'react'
import { getSession, useUser } from '@auth0/nextjs-auth0'

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
      <nav className="flex items-center flex-wrap bg-green-400 p-1">
        <div></div>
        <Link href="/">
          <a className="inline-flex items-center p-2 mr-4">
            <span className="text-xl text-white font-bold uppercase tracking-wide">WMS</span>
          </a>
        </Link>
        <button
          className="inline-flex p-2 hover:bg-green-600 rounded lg:hidden text-white ml-auto hover:text-white outline-none"
          onClick={handleClick}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/*Note that in this div we will use a ternary operator to decide whether or not to display the content of the div  */}
        <div className={`${active ? '' : 'hidden'}   w-full lg:inline-flex lg:flex-grow lg:w-auto`}>
          <div className="lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start  flex flex-col lg:h-auto">
            <Link href="/machines">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-green-600 hover:text-white ">
                Machines
              </a>
            </Link>
            <Link href="/">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-green-600 hover:text-white">
                Contact us
              </a>
            </Link>
            {!user && (
              <>
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a
                  href="/api/auth/login"
                  className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-green-600 hover:text-white"
                >
                  Log in
                </a>
              </>
            )}
            {user && (
              <>
                <Link href="/account">
                  <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-green-600 hover:text-white">
                    Account
                  </a>
                </Link>
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a
                  href="/api/auth/logout"
                  className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-green-600 hover:text-white"
                >
                  Log out
                </a>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

export default NavigationBar
