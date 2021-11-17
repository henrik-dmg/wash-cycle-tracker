import express from 'express'

export const authRouter = express.Router()

// - GET /

authRouter.get('/login', (req, res) => res.oidc.login({ returnTo: '/account/completeSetup' }))

// - GET /callback

authRouter.get('/callback', (request, response) => {
  console.log('We\'re getting GET callback lol')
  if (request.oidc.isAuthenticated()) {
    response.redirect('/bannerTest')
  } else {
    response.redirect('/')
  }
})

authRouter.post('/callback', (request, response) => {
  console.log('We\'re getting POST callback lol')
  if (request.oidc.isAuthenticated()) {
    response.redirect('/bannerTest')
  } else {
    response.redirect('/')
  }
})