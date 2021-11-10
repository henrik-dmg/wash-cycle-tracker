// - Environment setup

import dotenv from 'dotenv'

dotenv.config()

// - Imports

import path from 'path'
import express from 'express'
import { authRouter } from './app/routes/auth.router'
import * as statusRoute from './app/routes/status.router'
import * as landingRoute from './app/routes/landing.router'
import * as databaseServices from './app/services/database.service'
import { handleError, handleNotFound } from './app/routes/error.router'
import { accountRouter } from './app/routes/account.router'
import cookieSession from 'cookie-session'

// - Express Configuration

const PORT = process.env.PORT || 3000
const app = express()

const session = {
  keys: ['washing-machine-server-secret-lkasdlkaskld', 'and-another-secret', 'yeah-and-one-more'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}

app.use(cookieSession(session))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('views', path.join('.', 'app', 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join('.', 'app', 'public')))

// - Handling Requests

app.get('/', landingRoute.handleLandingGET)
app.get('/banner-test', landingRoute.handleBannerTestGET)
app.get('/status', statusRoute.handleStatusGET)
app.use(authRouter)
app.use(accountRouter)

// - Error Handling

app.get('*', handleNotFound)
app.use(handleError)

app.listen(PORT, async () => {
  await databaseServices.connectToDatabase()
  console.log(`Listening on localhost:${PORT}`)
})
