import { useEffect } from 'react'
import type { NextPage } from 'next'
import NavigationBar from '../navigationbar/NavigationBar'
import { lightModeClasses, darkModeClasses } from './layout.utilities'
import toast from 'react-hot-toast'

interface Props {
  children: any
  path: string
}

const Layout = ({ children, path }: Props) => {
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
      <div className="gradient-mesh" aria-hidden="true" />
      <div className="min-h-screen">
        <NavigationBar path={path} />
        {children}
      </div>
    </>
  )
}

export default Layout
