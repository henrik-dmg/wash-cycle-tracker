import express, { Request, Response } from 'express'
import { AuthState } from '../helpers/authstate'
import { createNewMachine, fetchExistingMachine } from '../services/machine.service'
import { checkPlaintextPassword } from '../services/password.service'

export const authRouter = express.Router()

// - Route Handlers

export function handleIndexGET(request, response: Response) {
  if (request.session.loggedin) {
    console.log('Redirecting from /auth to /status since user is already logged in')
    response.redirect('/status', 302)
  } else {
    response.render('auth/index')
  }
}

export function handleLoginGET(request, response: Response) {
  if (request.session.loggedin) {
    console.log('Redirecting from /auth/login to /status since user is already logged in')
    response.redirect('/status', 302)
  } else {
    response.render('auth/auth', { title: 'Log in' })
  }
}

export function handleSignupGET(request, response: Response) {
  if (request.session.loggedin) {
    console.log('Redirecting from /auth/signup to /status since user is already logged in')
    response.redirect('/status', 302)
  } else {
    response.render('auth/auth', { title: 'Sign up', signup: true })
  }
}

export async function handleAuthPOST(request, response: Response) {
  if (request.body.name && request.body.password) {
    if (request.body.passwordVerification) {
      await createNewUserAndHandleResult(request, response)
    } else {
      await loginExistingMachineAndHandleResult(request, response)
    }
  } else {
    response.send('We should not end up in this state once the form has validation')
    response.end()
  }
}

// - Actions

async function loginExistingMachineAndHandleResult(request: Request, response: Response) {
  console.log('Attempting to login existing user')
  const machine = await fetchExistingMachine(request.body.name)
  if (machine) {
    if (await checkPlaintextPassword(request.body.password, machine.passwordHash)) {
      signInUserAndRedirect(machine, AuthState.loggedIn, request, response)
    } else {
      response.render('auth/auth', { title: 'Log in', message: 'Wrong password or machine name. Please try again' })
    }
  } else {
    response.render('auth/auth', { title: 'Log in', message: 'Failed to load user. Please try again' })
  }
}

async function createNewUserAndHandleResult(request, response: Response) {
  console.log('Attempting to create new user')
  if (request.session.loggedin) {
    // Already signed in, post CTA and redirect to status
    response.redirect('/status?authState=alreadySignedIn')
  } else {
    console.log('Will attempt to create new user')
    const newUser = await createNewMachine(request.body.name, request.body.password)
    if (newUser) {
      signInUserAndRedirect(newUser, AuthState.signedUp, request, response)
    } else {
      response.redirect('/auth')
    }
  }
}

function signInUserAndRedirect(user, state: AuthState, request, response: Response) {
  console.log('Successfully authenticated. Redirecting to /status')
  request.session.loggedin = true
  request.session.userID = user._id
  response.redirect(`/status?authState=${state}`)
}
