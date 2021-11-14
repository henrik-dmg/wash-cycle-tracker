import express from 'express'

export const staticRouter = express.Router()

staticRouter.get('/', (request, response) => {
  response.render('landing/index')
})

staticRouter.get('/bannerTest', (request, response) => {
  response.render('landing/banner-test', {
    message: 'This is a test message',
    warning: 'This is a warning message',
    error: 'This is a error message',
  })
})