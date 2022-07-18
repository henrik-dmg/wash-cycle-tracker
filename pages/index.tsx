import Head from 'next/head'
import type { NextPage } from 'next'
import styles from '../styles/Default.module.css'

const HomePage: NextPage = () => {
  const selfIntroduction = "I'm a software engineer who likes to build things."
  const pageName = 'Washing Machine Server'
  return (
    <>
      <Head>
        <title>{pageName}</title>
      </Head>
      <main className={styles.defaultContainer}>
        <section>
          <p>{selfIntroduction}</p>
          <p>
            (This is a sample website - you&apos;ll be building a site like this on{' '}
            <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
          </p>
        </section>
      </main>
    </>
  )
}

export default HomePage
