import styles from './alert.module.css'
import classnames from 'classnames'

export default function Alert({ children, type }) {
  const classname = classnames({
    [styles.success]: type === 'success',
    [styles.error]: type === 'error',
    [styles.warning]: type === 'warning',
  })
  console.log(classname)
  return <div className={classname}>{children}</div>
}
