import styles from './loader.module.css'

export default function Loader({ isShown }) {
  return isShown ? <div className={styles.loader}></div> : null
}
