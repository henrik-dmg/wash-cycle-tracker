const databaseHelpers = require('../helpers/user-database-helpers')
const passwordHelpers = require('../helpers/password-helpers')
const AuthState = require('../helpers/auth-state')

// - Route Handlers

handleIndexGET = (request, response) => {
  if (request.session.loggedin) {
    response.redirect('/status', 302)
  } else {
    response.render('auth/index')
  }
}

handleLoginGET = (request, response) => {
  if (request.session.loggedin) {
    response.redirect('/status', 302)
  } else {
    response.render('auth/auth', { title: 'Log in' })
  }
}

handleSignupGET = (request, response) => {
  if (request.session.loggedin) {
    response.redirect('/status', 302)
  } else {
    response.render('auth/auth', { title: 'Sign up', signup: true })
  }
}

handleAuthPOST = async (request, response) => {
  if (request.body.username && request.body.password) {
    if (request.body.passwordVerification) {
      await createNewUserAndHandleResult(request, response)
    } else {
      await loginExistingUserAndHandleResult(request, response)
    }
  } else {
    response.send('We should not end up in this state once the form has validation')
    response.end()
  }
}

// - Exports

module.exports = {
  handleIndexGET,
  handleLoginGET,
  handleSignupGET,
  handleAuthPOST,
}

// - Actions

async function loginExistingUserAndHandleResult(request, response) {
  console.log('Attempting to login existing user')
  const user = await databaseHelpers.fetchUser(request.body.username)
  if (user) {
    if (await passwordHelpers.checkPlaintextPassword(request.body.password, user.passwordHash)) {
      signInUserAndRedirect(user, AuthState.loggedIn, request, response)
    } else {
      response.render('auth/auth', { title: 'Log in', message: 'Wrong password or username. Please try again' })
    }
  } else {
    response.render('auth/auth', { title: 'Log in', message: 'Failed to create user. Please try again' })
  }
}

async function createNewUserAndHandleResult(request, response) {
  console.log('Attempting to create new user')
  if (request.session.loggedin) {
    // Already signed in, post CTA and redirect to status
    response.redirect('/status?authState=alreadySignedIn')
  } else {
    console.log('Will attempt to create new user')
    const newUser = await databaseHelpers.createUser(request.body.username, request.body.password)
    if (newUser) {
      signInUserAndRedirect(newUser, AuthState.signedUp, request, response)
    } else {
      response.redirect('/auth')
    }
  }
}

function signInUserAndRedirect(user, state, request, response) {
  console.log('Successfully authenticated. Redirecting to /status')
  request.session.loggedin = true
  request.session.userID = user._id
  request.session.username = user.username
  response.redirect(`/status?authState=${state}`)
}
