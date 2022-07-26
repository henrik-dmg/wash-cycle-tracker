import { withApiAuthRequired, getSession, Session } from '@auth0/nextjs-auth0'
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'

export type APIHandlerWithSession<T = any> = (req: NextApiRequest, res: NextApiResponse<T>, session: Session) => unknown | Promise<unknown>
export type HandlerWithSessionEnsured<T = any> = (apiRoute: APIHandlerWithSession<T>) => NextApiHandler<T>

export const withSessionEnsured: HandlerWithSessionEnsured = (apiRoute) => {
  return withApiAuthRequired((request, response) => {
    const session = getSession(request, response)
    if (!session) {
      return response.status(500).json({ message: 'Session was not ensured by the server' })
    }
    return apiRoute(request, response, session)
  })
}
