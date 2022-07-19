import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import type { NextApiRequest, NextApiResponse } from 'next'
import { logAction } from '../../../lib/machine.service'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = getSession(req, res)
  if (!session) {
    return res.status(500).json({ message: 'Session was not ensured by the server' })
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
      throw `Invalid actio ${action} was passed`
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export default withApiAuthRequired(handler)
