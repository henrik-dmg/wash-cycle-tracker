import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import styles from '../../styles/Default.module.css'
import { FormEvent } from 'react'
import { Machine } from '@prisma/client'

const CreateMachine: NextPage = () => {
  const router = useRouter()

  const createNewMachineAndNavigate = async (event: FormEvent) => {
    // Get data from the form.
    const data = {
      name: event.target.name.value,
      description: event.target.description.value,
    }

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data)

    // API endpoint where we send form data.
    const endpoint = '/api/machines/create'

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: 'POST',
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    }

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options)

    if (!response.ok) {
      throw 'Could not create machine'
    }

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result: Machine = await response.json()

    if (result) {
      await router.push(`/machines/${result.id}`)
    } else {
      throw 'Could not create machine'
    }
  }

  // Handles the submit event on form submit.
  const handleSubmit = async (event: FormEvent) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault()

    toast.promise(
      createNewMachineAndNavigate(event),
      {
        loading: 'Saving...',
        success: <b>New machine created</b>,
        error: <b>Could not save. Please try again</b>,
      },
      {
        style: {
          minWidth: '250px',
        },
      }
    )
  }

  return (
    <main className={styles.defaultContainer}>
      <h1 className="title">Create Machine</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Machine Name</label>
        <input type="text" id="name" name="name" required />
        <label htmlFor="description">Description</label>
        <input type="text" id="description" name="description" required />
        <button type="submit">Submit</button>
      </form>
    </main>
  )
}

export default CreateMachine

export const getServerSideProps = withPageAuthRequired()
