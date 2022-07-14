import Head from 'next/head'
import Loader from '../components/Loader'

export default function HomePage() {
  const selfIntroduction = "I'm a software engineer who likes to build things."

  return (
    <>
      <Head>
        <title>{'Henrik Panhans'}</title>
      </Head>
      <main>
        <section>
          <p>{selfIntroduction}</p>
          <p>
            (This is a sample website - you&apos;ll be building a site like this on{' '}
            <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
          </p>
        </section>
        <Loader isShown />
        <a href="/api/auth/login">Login</a>
        <a href="/api/auth/logout">Logout</a>
      </main>
    </>
  )
}
