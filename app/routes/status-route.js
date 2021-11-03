const AuthState = require('../helpers/auth-state')
const washHelpers = require('../helpers/wash-database-helpers')

handleStatusGET = async (request, response) => {
  if (!request.session.loggedin) {
    response.redirect('/auth', 302, { warning: 'Please sign in first' })
    return
  }

  var contents = { title: 'Home' }
  const authState = request.query['authState']
  if (authState == AuthState.loggedIn || authState == AuthState.signedUp) {
    contents['message'] = 'Successfully logged in'
  }

  switch (request.query['state']) {
    case 'cleaned':
      await washHelpers.logCleanCycle(request)
      contents['washCycleCount'] = await washHelpers.numberOfWashCyclesSinceLastCleanCycle(request)
      console.log(contents['washCycleCount'])
      contents['message'] = 'Your cleaning cycle has been logged. Thank you'
      response.render('status/index', contents)
      break
    case 'washed':
      await washHelpers.logWashCycle(request)
      contents['washCycleCount'] = await washHelpers.numberOfWashCyclesSinceLastCleanCycle(request)
      console.log(contents['washCycleCount'])
      if (contents['washCycleCount'] >= washHelpers.maxWashCyclesWithoutCleaning) {
        contents['message'] = 'Your wash cycle has been logged. Please run the cleaning cycle soon.'
        response.render('status/index', contents)
      } else {
        contents['message'] = 'Your wash cycle has been logged.'
        response.render('status/index', contents)
      }
      break
    default:
      contents['washCycleCount'] = await washHelpers.numberOfWashCyclesSinceLastCleanCycle(request)
      console.log(contents['washCycleCount'])
      if (contents['washCycleCount'] >= washHelpers.maxWashCyclesWithoutCleaning) {
        contents['cta'] = 'Please run wash cycle'
      }
      response.render('status/index', contents)
      break
  }
}

module.exports = { handleStatusGET }
