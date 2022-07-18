import { useEffect } from 'react'
import type { NextPage } from 'next'
import NavigationBar from '../navigationbar/NavigationBar'
import { defaultBodyClasses } from '../../lib/style.utilities'

interface Props {
  children: any
  path: string
}

const Layout: NextPage<Props> = ({ children, path }) => {
  useEffect(() => {
    defaultBodyClasses().forEach((className) => {
      document.body.classList.add(className)
    })
  })

  return (
    <>
      <NavigationBar path={path} />
      {children}
    </>
  )
}

export default Layout
