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
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="table-fixed w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Action
                </th>
                <th scope="col" className="py-3 px-6">
                  Logged by
                </th>
                <th scope="col" className="py-3 px-6">
                  Date
                </th>
                <th scope="col" className="py-3 px-6">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="w-full">
              {actions.map((action, index) => (
                <tr className="bg-white dark:bg-gray-900 border-b dark:border-gray-700" key={action.id}>
                  <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {action.actionType}
                  </th>
                  <td className="py-4 px-6">{action.userId}</td>
                  <td className="py-4 px-6">{action.date.toString()}</td>
                  <td className="py-4 px-6">
                    <button className="font-medium text-red-600 dark:text-red-700 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MachineComponent
