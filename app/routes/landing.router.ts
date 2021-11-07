import { Request, Response } from 'express'

export async function handleLandingGET(request: Request, response: Response) {
  response.render('landing/index')
}

export async function handleBannerTestGET(request: Request, response: Response) {
  response.render('landing/banner-test', {
    message: 'This is a test message',
    warning: 'This is a warning message',
    error: 'This is a error message',
  })
}
