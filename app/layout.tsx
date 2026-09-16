import '../styles/globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Auth0Provider } from '@auth0/nextjs-auth0'
import { Toaster } from 'react-hot-toast'
import NavigationBar from '../components/navigationbar/NavigationBar'

export const metadata: Metadata = {
  title: 'Washing Machine Server',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white">
        <Auth0Provider>
          <div className="gradient-mesh" aria-hidden="true" />
          <div className="min-h-screen">
            <NavigationBar />
            {children}
          </div>
          <Toaster position="bottom-center" />
        </Auth0Provider>
      </body>
    </html>
  )
}
