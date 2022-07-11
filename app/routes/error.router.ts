import { Request, Response } from 'express'

export function handleError(error: Error, request: Request, response: Response) {
  const acceptsHTML = request.accepts('html')
  const acceptsJSON = request.accepts('json')

  if (acceptsJSON) {
    const responseObject = {
      error: 'Internal Server Error',
      code: 500,
      message: error.message,
      stack: error.stack
    }
    response.setHeader('Content-Type', 'application/json')
    response.status(500).end(JSON.stringify(responseObject))
  } else if (acceptsHTML) {
    response.setHeader('Content-Type', 'text/html')
    response.status(500).render('landing/servererror', { error: error.message, stack: error.stack })
  }
}

export function handleNotFound(request: Request, response: Response) {
  const acceptsHTML = request.accepts('html')
  const acceptsJSON = request.accepts('json')

  if (acceptsJSON) {
    const responseObject = {
      error: 'Requested resource not found',
      code: 404,
      message: `The requested resoure at ${request.url} was not found on the server`
    }
    response.setHeader('Content-Type', 'application/json')
    response.status(404).end(JSON.stringify(responseObject))
  } else if (acceptsHTML) {
    response.setHeader('Content-Type', 'text/html')
    response.status(404).render('landing/notfound', { requestedPage: request.url })
  }
}