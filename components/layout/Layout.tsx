import { useEffect } from 'react'
import type { NextPage } from 'next'
import NavigationBar from '../navigationbar/NavigationBar'
import { lightModeClasses, darkModeClasses } from './layout.styles'

interface Props {
  children: any
  path: string
}

const Layout: NextPage<Props> = ({ children, path }) => {
  useEffect(() => {
    lightModeClasses.forEach((className) => {
      document.body.classList.add(className)
    })
    darkModeClasses.forEach((className) => {
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
