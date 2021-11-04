import session from 'express-session'
import bodyParser from 'body-parser'
import path from 'path'
import express from 'express'
import { connectToDatabase, databaseURL } from './app/database/database'
import * as authRoute from './app/routes/auth-route'
import * as statusRoute from './app/routes/status-route'
import * as landingRoute from './app/routes/landing-route'
import MongoStore from 'connect-mongo'
import { projectName } from './app/config/project-config'

// - Express Configuration

const PORT = process.env.PORT || 3000
const app = express()

const sess = {
  secret: 'washing-machine-server-secret-lkasdlkaskld',
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: databaseURL, dbName: projectName }),
}

app.use(session(sess))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.set('views', path.join('.', 'app', 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join('.', 'app', 'public')))

// - Error Handling

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    next(err)
  }
}

function errorHandler(err, req, res, next) {
  res.status(500)
  res.render('error', { error: err })
}

app.use(clientErrorHandler)
app.use(errorHandler)

// - Handling Requests

app.get('/', landingRoute.handleLandingGET)
app.get('/banner-test', landingRoute.handleBannerTestGET)
app.get('/auth', authRoute.handleIndexGET)
app.get('/auth/login', authRoute.handleLoginGET)
app.get('/auth/signup', authRoute.handleSignupGET)
app.post('/auth/result', authRoute.handleAuthPOST)
app.get('/status', statusRoute.handleStatusGET)

app.listen(PORT, async () => {
  await connectToDatabase()
  console.log(`Listening on localhost:${PORT}`)
})
