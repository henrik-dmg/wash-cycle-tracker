import styles from '../styles/Default.module.css'

export function highlightableItem(...otherClassnames: string[]): string {
  return `${styles.highlightableItem} ${otherClassnames.join(' ')}`
}

export function defaultBodyClasses(): string[] {
  // const lightModeClasses =
  // const darkModeClasses = ['dark:bg-zinc-800', 'dark:text-white', 'bg-white', 'text-zinc-900']
  return ['bg-white', 'text-zinc-900', 'dark:bg-zinc-800', 'dark:text-white']
}
