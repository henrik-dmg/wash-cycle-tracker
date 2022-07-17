import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { findMachines } from "../../../lib/machine.service"

async function handler(req, res) {
  try {
    const machines = await findMachines()
    return res.status(200).json({ machines })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export default withApiAuthRequired(handler);