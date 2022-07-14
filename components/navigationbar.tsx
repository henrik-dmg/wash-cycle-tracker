import styles from './navigationbar.module.css'
import Link from 'next/link'
import Image from 'next/image'
import utilStyles from '../styles/utils.module.css'

const name = 'Henrik Panhans'
export const siteTitle = 'Next.js Sample Website'

export default function NavigationBar(home: boolean) {
  return (
    <header className={styles.header}>
      {home ? (
        <>
          <Image priority src="/images/space_cat.jpg" className={utilStyles.borderCircle} height={144} width={144} alt={name} />
          <h1 className={utilStyles.heading2Xl}>{name}</h1>
        </>
      ) : (
        <>
          <Link href="/">
            <a>
              <Image priority src="/images/space_cat.jpg" className={utilStyles.borderCircle} height={108} width={108} alt={name} />
            </a>
          </Link>
          <h2 className={utilStyles.headingLg}>
            <Link href="/">
              <a className={utilStyles.colorInherit}>{name}</a>
            </Link>
          </h2>
        </>
      )}
    </header>
  )
}
