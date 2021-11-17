import express, { response } from 'express'
import { requiresAuth } from 'express-openid-connect'
import { asyncQuery, sqlConnection } from '../services/database.service'
import { createNewDatabaseUser, fetchExistingUserByID } from '../services/user.service'

export const accountRouter = express.Router()

accountRouter.get('/account', requiresAuth(), async (request, response) => {
  await fetchAndDisplayCurrentUser(request, response)
})

accountRouter.get('/account/completeSetup', requiresAuth(), async (request, response, next) => {
  const user = await fetchExistingUserByID(request.oidc.user.sub)
  console.log(user)
  if (user) {
    response.redirect('/status')
  } else {
    console.log('Creating new user')
    const newUser = await createNewDatabaseUser(request.oidc, 1)
    console.log(newUser)
    response.render('account/completeSetup')
  }
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