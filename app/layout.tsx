import '../styles/globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import NavigationBar from '../components/navigationbar/NavigationBar'
import { MachineStoreProvider } from '../lib/store/context'
import { deploymentMode } from '../lib/deployment-mode'

export const metadata: Metadata = {
  title: 'Washing Machine Server',
  description: 'Log the washes of your washing machines and see the washes since the latest cleaning. Self-hostable with Docker Compose.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white">
        <div className="gradient-mesh" aria-hidden="true" />
        <MachineStoreProvider>
          <div className="min-h-screen">
            <NavigationBar mode={deploymentMode} />
            {children}
          </div>
          <Toaster position="bottom-center" />
        </MachineStoreProvider>
      </body>
    </html>
  )
}
