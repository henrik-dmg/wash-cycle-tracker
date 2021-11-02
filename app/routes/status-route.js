handleStatusGET = async (request, response) => {
  if (!request.session.loggedin) {
    response.redirect('/auth', 302, { cta: 'Please sign in first' })
    return
  }

  // TODO
  response.render('status/index', contents)
  return

  var contents = { title: 'Home' }
  switch (request.query['state']) {
    case 'cleaned':
      await logCleanCycle()
      contents['washCycleCount'] = await numberOfWashCyclcesSinceLastCleaning()
      console.log(contents['washCycleCount'])
      contents['message'] = 'Your cleaning cycle has been logged. Thank you'
      response.render('status/index', contents)
      break
    case 'washed':
      await logWashCycle()
      contents['washCycleCount'] = await numberOfWashCyclcesSinceLastCleaning()
      console.log(contents['washCycleCount'])
      if (contents['washCycleCount'] >= maxWashCyclesWithoutCleaning) {
        contents['message'] = 'Your wash cycle has been logged. Please run the cleaning cycle soon.'
        response.render('status/index', contents)
      } else {
        contents['message'] = 'Your wash cycle has been logged.'
        response.render('status/index', contents)
      }
      break
    default:
      contents['washCycleCount'] = await numberOfWashCyclcesSinceLastCleaning()
      console.log(contents['washCycleCount'])
      if (contents['washCycleCount'] >= maxWashCyclesWithoutCleaning) {
        contents['cta'] = 'Please run wash cycle'
      }
      response.render('status/index', contents)
      break
  }
}

module.exports = { handleStatusGET }
