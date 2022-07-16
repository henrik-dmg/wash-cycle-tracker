import type { NextPage } from 'next'

const CreateMachine: NextPage = () => {
  return (
    <main>
      <h1 className="title">Create Machine</h1>
      <form action="/send-data-here" method="post">
        <label htmlFor="roll">Roll Number</label>
        <input type="text" id="roll" name="roll" required minLength={10} maxLength={20} />
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" required />
        <button type="submit">Submit</button>
      </form>
    </main>
  )
}

export default CreateMachine
