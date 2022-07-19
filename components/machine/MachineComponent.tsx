import styles from './machinecomponent.module.css'
import { highlightableItem } from '../../lib/style.utilities'
import { Action, Machine } from '@prisma/client'
import { FunctionComponent, useState } from 'react'
import './machinecomponent.module.css'
import jsonFetcher from '../../lib/jsonFetcher'
import toast from 'react-hot-toast'
import { MachineWithActions } from '../../lib/machine.service'

interface Props {
  machine: MachineWithActions
}

const MachineComponent: FunctionComponent<Props> = (props) => {
  const [actions, setActions] = useState(props.machine.actions ?? [])

  async function logAction(actionType: string) {
    console.log('Wash cycle was clicked')
    try {
      const action = (await jsonFetcher(`/api/machines/${props.machine.id}/${actionType}`)) as Action
      setActions(actions.concat([action]))
      toast.success(`Successfully logged ${actionType} cycle`)
      console.log(actions)
    } catch (error) {
      toast.error('Something went wrong')
      console.error(error)
    }
  }

  return (
    <div key={props.machine.id}>
      <h2 className="text-3xl font-bold">{props.machine.name}</h2>
      <h4>{props.machine.id}</h4>
      <p>{props.machine.createdAt.toString()}</p>

      {actions && (
        <ul>
          {actions.map((action) => (
            <li key={action.id}>{action.actionType}</li>
          ))}
        </ul>
      )}

      <div className="flex flex-row-reverse flex-wrap-reverse gap-2 object-none object-right">
        <button className={styles.washcycleButton} onClick={() => logAction('wash')}>
          Log wash cycle
        </button>
        <button className={styles.cleancycleButton} onClick={() => logAction('clean')}>
          Log clean cycle
        </button>
      </div>
    </div>
  )
}

export default MachineComponent
