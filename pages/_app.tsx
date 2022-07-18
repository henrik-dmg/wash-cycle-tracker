import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react'
import { UserProvider } from '@auth0/nextjs-auth0'
import { Toaster } from 'react-hot-toast'
import Layout from '../components/layout/Layout'

function WashingMachineApp({ Component, pageProps, router }: AppProps) {
  return (
    <UserProvider>
      <Layout path={router.asPath}>
        <Component {...pageProps} />
      </Layout>
      <Toaster />
    </UserProvider>
  )
}

export default WashingMachineApp
