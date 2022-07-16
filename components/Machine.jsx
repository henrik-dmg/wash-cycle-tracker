import styles from './machine.module.css'

export default function Machine({ machine }) {
  return (
    <div key={machine.id}>
      <h2>{machine.name}</h2>
      <h4>{machine.id}</h4>
      <p>{machine.createdAt}</p>
    </div>
  )
}
