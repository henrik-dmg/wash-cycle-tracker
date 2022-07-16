import prisma from '../../lib/prisma.js'
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { env } from 'process';

async function handler(req, res) {
  console.log("Machines API route was called")
  return res.status(500).json({ message: 'Something went wrong' })

  if (req.method === 'GET') {
    try {
      const data = await prisma[env.DATABASE_NAME].findMany({})
      return res.status(200).json({ data })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ msg: 'Something went wrong' })
    }
  } else {
    return res.status(405).json({ msg: 'Method not allowed' })
  }
}

export default withApiAuthRequired(handler);