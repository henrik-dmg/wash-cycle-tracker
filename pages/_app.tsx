import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react'
import { UserProvider } from '@auth0/nextjs-auth0'
import NavigationBar from  '../components/NavigationBar'

function WashingMachineApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <NavigationBar />
      <Component {...pageProps} />
    </UserProvider>
  )
}

export default WashingMachineApp
