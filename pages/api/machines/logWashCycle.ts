import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = getSession(req, res)
  if (!session) {
    return res
      .status(500)
      .json({ message: 'Session was not ensured by the server' })
  }
  const { user } = session
}

export default withApiAuthRequired(handler);