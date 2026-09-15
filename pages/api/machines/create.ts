import { withSessionEnsured } from '../../../lib/session.utilities'
import type { SessionData } from '@auth0/nextjs-auth0/types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createMachine } from '../../../lib/machine.service'

async function handler(req: NextApiRequest, res: NextApiResponse, session: SessionData) {
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
