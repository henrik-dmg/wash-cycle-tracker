// - Environment setup

import dotenv from 'dotenv'

dotenv.config()

// - Imports

import path from 'path'
import express from 'express'
import { authRouter } from './app/routes/auth.router'
import * as statusRoute from './app/routes/status.router'
import { staticRouter } from './app/routes/static.router'
import * as databaseServices from './app/services/database.service'
import { handleError, handleNotFound } from './app/routes/error.router'
import { accountRouter } from './app/routes/account.router'
import cookieSession from 'cookie-session'
import { renderSassAndWriteToPublicDirectory } from './app/services/sass.service'

// - Express Configuration

const publicDirectory = path.join('.', 'app', 'public')
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
app.use(express.static(publicDirectory))

// - Handling Requests

app.get('/status', statusRoute.handleStatusGET)
app.use(staticRouter)
app.use(authRouter)
app.use(accountRouter)

// - Error Handling

app.get('*', handleNotFound)
app.use(handleError)

app.listen(PORT, async () => {
  console.log('Compiling SCSS...')
  await renderSassAndWriteToPublicDirectory()
  console.log('Successfully compiled SCSS')

  console.log('Connecting to database...')
  await databaseServices.connectToDatabase()
  console.log('Successfully connected to database')

  console.log(`Listening on http://localhost:${PORT}`)
})
