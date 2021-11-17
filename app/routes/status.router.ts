import { AuthState } from '../helpers/authstate'
import * as express from 'express'
import { customRender } from '../helpers/customrender'
import { requiresAuth } from 'express-openid-connect'

export const statusRouter = express.Router()

statusRouter.get('/status', requiresAuth(), async (request, response) => {
  console.log(JSON.stringify(request.oidc.user, null, 4))
  const contents = { title: 'Home', loggedIn: true }
  const authState = request.query['authState']
  if (authState === AuthState.loggedIn || authState === AuthState.signedUp) {
    contents['message'] = 'Successfully logged in'
  }

  customRender('status/index', request, response, contents)

  // switch (request.query['state']) {
  //   case 'cleaned':
  //     await washHelpers.logCleanCycle(request)
  //     contents['washCycleCount'] = await washHelpers.numberOfWashCyclesSinceLastCleanCycle(request)
  //     console.log(contents['washCycleCount'])
  //     contents['message'] = 'Your cleaning cycle has been logged. Thank you'
  //     response.render('status/index', contents)
  //     break
  //   case 'washed':
  //     await washHelpers.logWashCycle(request)
  //     contents['washCycleCount'] = await washHelpers.numberOfWashCyclesSinceLastCleanCycle(request)
  //     console.log(contents['washCycleCount'])
  //     if (contents['washCycleCount'] >= washHelpers.maxWashCyclesWithoutCleaning) {
  //       contents['message'] = 'Your wash cycle has been logged. Please run the cleaning cycle soon.'
  //       response.render('status/index', contents)
  //     } else {
  //       contents['message'] = 'Your wash cycle has been logged.'
  //       response.render('status/index', contents)
  //     }
  //     break
  //   default:
  //     contents['washCycleCount'] = await washHelpers.numberOfWashCyclesSinceLastCleanCycle(request)
  //     console.log(contents['washCycleCount'])
  //     if (contents['washCycleCount'] >= washHelpers.maxWashCyclesWithoutCleaning) {
  //       contents['cta'] = 'Please run wash cycle'
  //     }
  //     response.render('status/index', contents)
  //     break
  // }
})
