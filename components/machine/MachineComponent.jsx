import styles from './machinecomponent.module.css'
import { highlightableItem } from '../../lib/style.utilities'

export default function MachineComponent({ machine }) {
  return (
    <div key={machine.id}>
      <h2 className="text-3xl font-bold">{machine.name}</h2>
      <h4>{machine.id}</h4>
      <p>{machine.createdAt}</p>
    </div>
  )
}
