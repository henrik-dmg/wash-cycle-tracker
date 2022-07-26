import { withSessionEnsured } from '../../../lib/session.utilities'
import { Session } from '@auth0/nextjs-auth0'
import type { NextApiRequest, NextApiResponse } from 'next'
import { logAction } from '../../../lib/machine.service'

async function handler(req: NextApiRequest, res: NextApiResponse, session: Session) {
  if (req.method !== 'POST') {
    return res.status(400).json({ message: `${req.method} is not allowed` })
  }

  const { user } = session
  const slug = req.query['slug'] as string[]

  const machineId = parseInt(slug[0] as string)
  const action = slug[1]

  try {
    if (!machineId) {
      throw 'Invalid path called, machine id should come after /machines'
    }
    if (action === 'clean' || action === 'wash') {
      const washAction = await logAction(action, machineId, user.sub)
      return res.status(200).json(washAction)
    } else {
      throw `Invalid action ${action} was passed`
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export default withSessionEnsured(handler)
