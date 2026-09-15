import '../styles/globals.css'
import '../styles/Default.module.css'
import type { AppProps } from 'next/app'
import React from 'react'
import { Auth0Provider } from '@auth0/nextjs-auth0'
import { Toaster } from 'react-hot-toast'
import Layout from '../components/layout/Layout'

function WashingMachineApp({ Component, pageProps, router }: AppProps) {
  return (
    <Auth0Provider>
      <Layout path={router.asPath}>
        <Component {...pageProps} />
      </Layout>
      <Toaster position="bottom-center" />
    </Auth0Provider>
  )
}

export default WashingMachineApp
