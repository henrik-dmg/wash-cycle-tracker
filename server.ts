// - Environment setup

import dotenv from 'dotenv'

dotenv.config()

// - Imports

import session from 'express-session'
import path from 'path'
import express from 'express'
import { authRouter } from './app/routes/auth.router'
import * as statusRoute from './app/routes/status.router'
import * as landingRoute from './app/routes/landing.router'
import MongoStore from 'connect-mongo'
import * as databaseServices from './app/services/database.service'
import { handleError, handleNotFound } from './app/routes/error.router'

// - Express Configuration

const PORT = process.env.PORT || 3000
const app = express()

const sess = {
  secret: 'washing-machine-server-secret-lkasdlkaskld',
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: databaseServices.helpers.databaseURL, dbName: process.env.MONGODB_DATABASE_NAME }),
}

app.use(session(sess))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('views', path.join('.', 'app', 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join('.', 'app', 'public')))

// - Handling Requests

app.get('/', landingRoute.handleLandingGET)
app.get('/banner-test', landingRoute.handleBannerTestGET)
app.use(authRouter)
app.get('/status', statusRoute.handleStatusGET)

// - Error Handling

app.get('*', handleNotFound)
app.use(handleError)

app.listen(PORT, async () => {
  await databaseServices.connectToDatabase()
  console.log(`Listening on localhost:${PORT}`)
})
