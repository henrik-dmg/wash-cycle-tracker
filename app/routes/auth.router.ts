import express, { Request, Response } from 'express'
import { AuthState } from '../helpers/authstate'
import { QueryError } from '../helpers/queryerror'
import Machine from '../models/machine'
import { createNewMachine, fetchExistingMachine } from '../services/machine.service'
import { checkPlaintextPassword } from '../services/password.service'

export const authRouter = express.Router()

// - GET /auth

function getIndexPage(request: Request, response: Response) {
  if (request.session.machineID) {
    console.log('Redirecting from /auth to /status since user is already logged in')
    response.redirect('/status', 302)
  } else {
    response.render('auth/index')
  }
}
authRouter.get('/auth/', getIndexPage)

// - GET /auth/login

function getLoginPage(request: Request, response: Response, contents: {}) {
  if (request.session.machineID) {
    console.log('Redirecting from /auth/login to /status since user is already logged in')
    response.redirect('/status')
  } else {
    contents['title'] = 'Log in'
    renderAuthForm(request, response, contents)
  }
}
authRouter.get('/auth/login', (request, response) => {
  getLoginPage(request, response, {})
})

// - GET /auth/signup

function getSignupPage(request: Request, response: Response, contents: {}) {
  if (request.session.machineID) {
    console.log('Redirecting from /auth/signup to /status since user is already logged in')
    response.redirect('/status')
  } else {
    contents['title'] = 'Sign up'
    contents['signup'] = true
    renderAuthForm(request, response, contents)
  }
}
authRouter.get('/auth/signup', (request, response) => {
  getSignupPage(request, response, {})
})

// - POST /auth/result

async function postResult(request: Request, response: Response) {
  if (request.body.name && request.body.password) {
    if (request.body.passwordVerification) {
      await createNewUserAndHandleResult(request, response)
    } else {
      await loginExistingMachineAndHandleResult(request, response)
    }
  } else {
    response.status(500).send('We should not end up in this state once the form has validation')
    response.end()
  }
}
authRouter.post('/auth/result', postResult)

// - GET /auth/signout

function getSignout(request: Request, response: Response) {
  if (!request.session.loggedIn) {
    response.redirect('/')
    return
  }
  request.session.destroy((error) => {
    if (error) {
      console.error(error)
    }
    response.redirect('/')
  })
}
authRouter.get('/auth/signout', getSignout)

// - Actions

async function loginExistingMachineAndHandleResult(request: Request, response: Response) {
  console.log('Attempting to login existing user')
  const machine = await fetchExistingMachine(request.body.name)
  if (machine) {
    if (await checkPlaintextPassword(request.body.password, machine.passwordHash)) {
      signInUserAndRedirect(machine, AuthState.loggedIn, request, response)
    } else {
      renderAuthForm(request, response, { title: 'Log in', error: 'Wrong password or machine name. Please try again' })
    }
  } else {
    renderAuthForm(request, response, { title: 'Log in', error: 'Failed to load user. Please try again' })
  }
}

async function createNewUserAndHandleResult(request: Request, response: Response) {
  console.log('Creating new user if passwords match')

  if (request.body.passwordVerification != request.body.password) {
    response.redirect(`/auth/signup?authState=${AuthState.invalidCredentials}`)
  } else {
    console.log('Will attempt to create new user')
    try {
      const newMachine = await createNewMachine(request.body.name, request.body.password)
      if (newMachine) {
        signInUserAndRedirect(newMachine, AuthState.signedUp, request, response)
      } else {
        response.redirect('/auth/signup')
      }
    } catch (error) {
      getSignupPage(request, response, { error: error })
    }
  }
}

function signInUserAndRedirect(machine: Machine, state: AuthState, request: Request, response: Response) {
  console.log('Regenerating session...')
  request.session.regenerate((error) => {
    if (error) {
      console.error(error)
      renderAuthForm(request, response, { error: 'Something went wrong' })
    } else {
      console.log('Successfully authenticated. Redirecting to /status')
      console.log(machine)
      request.session.loggedIn = true
      request.session.machineID = machine._id.toString()
      response.redirect(`/status?authState=${state}`)
    }
  })
}

function renderAuthForm(request: Request, response: Response, contents?: any) {
  if (request.query.error == QueryError.generic) {
    contents.error = 'Something went wrong. Please try again'
  }
  if (request.query.authState == AuthState.invalidCredentials) {
    contents.error = 'Invalid credentials. Please try again'
  }
  contents.loggedIn = request.session.loggedIn
  response.render('auth/auth', contents)
}
