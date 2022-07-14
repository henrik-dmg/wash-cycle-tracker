import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react'
import { UserProvider } from '@auth0/nextjs-auth0'
import NavigationBar from '../components/NavigationBar'
import { Toaster } from 'react-hot-toast'

function WashingMachineApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <NavigationBar />
      <Component {...pageProps} />
      <Toaster />
    </UserProvider>
  )
}

export default WashingMachineApp
