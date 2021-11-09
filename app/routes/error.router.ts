import { Request, Response, NextFunction } from 'express'

export function handleError(error: Error, request: Request, response: Response, next: NextFunction) {
  response.status(500).render('landing/servererror', { error: error.message, stack: error.stack })
}

export function handleNotFound(request: Request, response: Response) {
  response.status(404).render('landing/notfound', { requestedPage: request.url })
}