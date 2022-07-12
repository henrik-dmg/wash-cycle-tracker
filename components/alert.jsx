import styles from './alert.module.css';
import classnames from 'classnames';

export default function Alert({ children, type }) {
  return (
    <div
      className={classnames({
        [styles.success]: type === 'success',
        [styles.error]: type === 'error',
        [styles.warning]: type === 'warning',
      })}
    >
      {children}
    </div>
  );
}