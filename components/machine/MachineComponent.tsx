import styles from './machinecomponent.module.css'
import { highlightableItem } from '../../lib/style.utilities'
import { Action, Machine } from '@prisma/client'
import { FunctionComponent, useState } from 'react'
import './machinecomponent.module.css'
import toast from 'react-hot-toast'
import { MachineWithActions } from '../../lib/machine.service'

interface Props {
  machine: MachineWithActions
}

const MachineComponent: FunctionComponent<Props> = (props) => {
  const [actions, setActions] = useState(props.machine.actions ?? [])

  async function logAction(actionType: string) {
    console.log('Wash cycle was clicked')

    // API endpoint where we send form data.
    const endpoint = `/api/machines/${props.machine.id}/${actionType}`

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: 'POST',
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
      },
    }
    try {
      // Send the form data to our forms API on Vercel and get a response.
      const response = await fetch(endpoint, options)

      if (!response.ok) {
        throw 'Could not create machine'
      }

      // Get the response data from server as JSON.
      // If server returns the name submitted, that means the form works.
      const action: Action = await response.json()
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

      <div className="flex flex-row-reverse flex-wrap-reverse gap-2 object-none object-right">
        <button className={styles.washcycleButton} onClick={() => logAction('wash')}>
          Log wash cycle
        </button>
        <button className={styles.cleancycleButton} onClick={() => logAction('clean')}>
          Log clean cycle
        </button>
      </div>

      {actions && (
        <table className="container table-auto">
          <thead>
            <tr>
              <th>Action</th>
              <th>Logged by</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {actions.map((action) => (
              <tr key={action.id}>
                <td>{action.actionType}</td>
                <td>{action.userId}</td>
                <td>{action.date.toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default MachineComponent
