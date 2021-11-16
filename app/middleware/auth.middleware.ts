import { auth, ConfigParams } from 'express-openid-connect'

const config: ConfigParams = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_CLIENT_SECRET,
  baseURL: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: 'https://panhans.eu.auth0.com',
  routes: {
    login: false
  }
}

export const authMiddleware = auth(config)