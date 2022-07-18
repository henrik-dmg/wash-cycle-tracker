import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { createMachine } from "../../../lib/machine.service"

async function handler(req, res) {
  const { user } = getSession(req, res);
  const body = req.body

  try {
    const machine = await createMachine(body.name, body.description, user.sub)
    return res.status(200).json(machine)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export default withApiAuthRequired(handler);