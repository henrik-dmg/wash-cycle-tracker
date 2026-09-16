import { redirect } from 'next/navigation'
import { auth, oidcConfigured } from '../../lib/auth'
import styles from '../../styles/Default.module.css'

// Starts the OIDC sign-in flow and sends the browser straight to the identity provider.
export default async function LoginPage(props: PageProps<'/login'>) {
  if (!oidcConfigured) {
    return (
      <main className={styles.defaultContainer}>
        <div className="glass-card mx-auto mt-16 max-w-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Sign-in is not set up</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            The server operator has not set OIDC_ISSUER, OIDC_CLIENT_ID and OIDC_CLIENT_SECRET yet. Ask them to add these to the .env file.
          </p>
        </div>
      </main>
    )
  }

  const { returnTo } = await props.searchParams
  const callbackURL = typeof returnTo === 'string' ? returnTo : '/machines'
  const { url } = await auth.api.signInSocial({ body: { provider: 'oidc', callbackURL } })
  if (!url) {
    throw new Error('The OIDC provider did not return a sign-in URL')
  }
  redirect(url)
}
