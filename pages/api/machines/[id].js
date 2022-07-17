import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { findMachine } from "../../../lib/machine.service"

async function handler(req, res) {
  const { id }  = req.query

  try {
    const machine = await findMachine(parseInt(id))
    return res.status(200).json({ machine })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export default withApiAuthRequired(handler);