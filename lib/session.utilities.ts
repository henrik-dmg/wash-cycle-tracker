import { auth0 } from './auth0'
import type { SessionData } from '@auth0/nextjs-auth0/types'
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'

export type APIHandlerWithSession<T = any> = (req: NextApiRequest, res: NextApiResponse<T>, session: SessionData) => unknown | Promise<unknown>
export type HandlerWithSessionEnsured<T = any> = (apiRoute: APIHandlerWithSession<T>) => NextApiHandler<T>

export const withSessionEnsured: HandlerWithSessionEnsured = (apiRoute) => {
  return auth0.withApiAuthRequired(async (request: NextApiRequest, response: NextApiResponse) => {
    const session = await auth0.getSession(request)
    if (!session) {
      return response.status(500).json({ message: 'Session was not ensured by the server' })
    }
    return apiRoute(request, response, session)
  })
}
