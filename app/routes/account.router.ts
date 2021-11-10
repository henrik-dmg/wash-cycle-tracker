import express from 'express'
import { signOutSession } from '../helpers/session.helpers'
import { deleteUserAndCascade, fetchExistingUserByID } from '../services/user.service'

export const accountRouter = express.Router()

accountRouter.get('/account', async (request, response) => {
  if (request.session.userID) {
    await fetchAndDisplayCurrentUser(request, response)
  } else {
    response.redirect('/auth')
  }
})

accountRouter.get('/account/changePassword', async (request, response) => {
  if (request.session.userID) {
    await fetchAndDisplayCurrentUser(request, response)
  } else {
    response.redirect('/auth')
  }
})

accountRouter.get('/account/deleteAccount', async (request, response) => {
  if (request.session.userID) {
    try {
      await deleteUserAndCascade(request.session.userID)
      signOutSession(request)
      response.redirect('/')
    } catch (error) {
      response.redirect('/account')
    }
  } else {
    response.redirect('/auth')
  }
})

async function fetchAndDisplayCurrentUser(request: express.Request, response: express.Response) {
  console.log('Fetching user for account page...')
  const user = await fetchExistingUserByID(request.session.userID)
  if (user) {
    response.render('account/index', { user: user.name })
  } else {
    response.status(500).send('Could not find user')
  }
}