import { withSessionEnsured } from '../../../lib/session.utilities'
import { Session } from '@auth0/nextjs-auth0'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createMachine } from '../../../lib/machine.service'

async function handler(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const body = req.body

  try {
    const machine = await createMachine(body.name, body.description, session.user.sub)
    return res.status(200).json(machine)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export default withSessionEnsured(handler)
