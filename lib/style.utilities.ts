import styles from '../styles/Default.module.css'

export function highlightableItem(...otherClassnames: string[]): string {
  return `${styles.highlightableItem} ${otherClassnames.join(' ')}`
}

export function defaultBodyClasses(): string[] {
  const lightModeClasses = ['bg-white', 'text-zinc-900']
  const darkModeClasses = ['dark:bg-zinc-800', 'dark:text-white']
  return lightModeClasses.concat(darkModeClasses)
}
