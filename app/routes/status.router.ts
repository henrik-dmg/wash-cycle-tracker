import { AuthState } from '../helpers/authstate'
import * as express from 'express'
import { customRender } from '../helpers/customrender'
import { requiresAuth } from 'express-openid-connect'
import * as washingService from '../services/washing.service'

export const statusRouter = express.Router()

statusRouter.get('/status', requiresAuth(), async (request, response) => {
  console.log(JSON.stringify(request.oidc.user, null, 4))
  const contents = { title: 'Home', loggedIn: true }
  const authState = request.query['authState']
  if (authState === AuthState.loggedIn || authState === AuthState.signedUp) {
    contents['message'] = 'Successfully logged in'
  }

  switch (request.query['state']) {
    case 'cleaned':
      await washingService.logCleanCycle(request)
      contents['washCycleCount'] = await washingService.numberOfWashCyclesSinceLastCleanCycle(request)
      console.log(contents['washCycleCount'])
      contents['message'] = 'Your cleaning cycle has been logged. Thank you'
      break
    case 'washed':
      await washingService.logWashCycle(request)
      contents['washCycleCount'] = await washingService.numberOfWashCyclesSinceLastCleanCycle(request)
      console.log(contents['washCycleCount'])
      if (contents['washCycleCount'] >= washingService.maxWashCyclesWithoutCleaning) {
        contents['message'] = 'Your wash cycle has been logged. Please run the cleaning cycle soon.'
      } else {
        contents['message'] = 'Your wash cycle has been logged.'
      }
      break
    default:
      contents['washCycleCount'] = await washingService.numberOfWashCyclesSinceLastCleanCycle(request)
      console.log(contents['washCycleCount'])
      if (contents['washCycleCount'] >= washingService.maxWashCyclesWithoutCleaning) {
        contents['cta'] = 'Please run wash cycle'
      }
      break
  }

  customRender('status/index', request, response, contents)
})
