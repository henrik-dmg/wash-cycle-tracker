import styles from './machinecomponent.module.css'
import { highlightableItem } from '../../lib/style.utilities'
import { Machine } from '@prisma/client'
import { FunctionComponent } from 'react'
import './machinecomponent.module.css'

interface Props {
  machine: Machine
}

const MachineComponent: FunctionComponent<Props> = ({ machine }: Props) => {
  return (
    <div key={machine.id}>
      <h2 className="text-3xl font-bold">{machine.name}</h2>
      <h4>{machine.id}</h4>
      <p>{machine.createdAt.toString()}</p>

      <button className={styles.washcycleButton}>
        Button
      </button>
    </div>
  )
}

export default MachineComponent
