import styles from './machinecomponent.module.css'

export default function MachineComponent({ machine }) {
  return (
    <div key={machine.id}>
      <h2 className="text-3xl font-bold underline">{machine.name}</h2>
      <h4>{machine.id}</h4>
      <p>{machine.createdAt}</p>
    </div>
  )
}
