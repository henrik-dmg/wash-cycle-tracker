import express from 'express'
import { requiresAuth } from 'express-openid-connect'
import { deleteUserAndCascade, fetchExistingUserByID } from '../services/user.service'

export const accountRouter = express.Router()

accountRouter.get('/account', requiresAuth(), async (request, response) => {
  await fetchAndDisplayCurrentUser(request, response)
})

accountRouter.get('/account/changePassword', requiresAuth(), async (request, response) => {
  await fetchAndDisplayCurrentUser(request, response)
})

accountRouter.get('/account/deleteAccount', requiresAuth() ,async (request, response) => {
  try {
      // await deleteUserAndCascade(request.oidc.user[])
      response.redirect('/')
    } catch (error) {
      response.redirect('/account')
    }
})

async function fetchAndDisplayCurrentUser(request: express.Request, response: express.Response) {
  console.log('Fetching user for account page...')
  response.render('account/index', { user: request.oidc.user.email })

  // const user = await fetchExistingUserByID(request.session.userID)
  // if (user) {
  //   response.render('account/index', { user: user.name })
  // } else {
  //   response.status(500).send('Could not find user')
  // }
}