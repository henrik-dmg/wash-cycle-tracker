import session from 'express-session'
import bodyParser from 'body-parser'
import path from 'path'
import express from 'express'
import { connectToDatabase } from './app/database/database'
import * as authRoute from './app/routes/auth-route'
import * as statusRoute from './app/routes/status-route'
import * as landingRoute from './app/routes/landing-route'

// - Express Configuration

const PORT = process.env.PORT || 3000
const app = express()

var sess = {
  secret: 'washing-machine-server-secret-lkasdlkaskld',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false },
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
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
