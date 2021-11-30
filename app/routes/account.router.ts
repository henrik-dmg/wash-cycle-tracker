import express from 'express'
import { requiresAuth } from 'express-openid-connect'
import { deleteAccountAndCascade } from '../services/account.service'
import { createMachine } from '../services/machine.service'
import { createUser, fetchUserByID } from '../services/user.service'

export const accountRouter = express.Router()

accountRouter.get('/account', requiresAuth(), async (request, response) => {
  const user = await fetchUserByID(request.oidc.user.sub)
  const contents: any = { user: request.oidc.user.name }
  if (!user?.machine) {
    contents.showSetupCompletion = true
  }
  response.render('account/index', contents)
})

accountRouter.get('/account/completeSetup', requiresAuth(), async (request, response) => {
  response.render('account/completeSetup')
})

accountRouter.post('/account/createMachine', requiresAuth(), async (request, response, next) => {
  const machine = await createMachine(request.body['name'])
  const user = await fetchUserByID(request.oidc.user.sub)
  if (user !== undefined) {
    next(new Error('User already exists in database. Should not happen'))
  } else if (machine !== undefined) {
    console.log('Creating new user')
    const newUser = await createUser(request.oidc, machine)
    console.log(newUser)
    response.redirect('/status')
  } else {
    next(new Error('Could not create new machine'))
  }
})

accountRouter.get('/account/changePassword', requiresAuth(), async (request, response) => {
  await fetchAndDisplayCurrentUser(request, response)
})

accountRouter.get('/account/deleteAccount', requiresAuth() ,async (request, response) => {
  try {
      await deleteAccountAndCascade(request.oidc.user.sub)
      response.redirect('/')
    } catch (error) {
      response.redirect('/account')
    }
})

async function fetchAndDisplayCurrentUser(request: express.Request, response: express.Response) {
  console.log('Fetching user for account page...')

  const user = await fetchUserByID(request.oidc.user.sub)
  if (user) {
    response.render('account/index', { user: user.name })
  } else {
    response.status(500).send('Could not find user')
  }
}