const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')
const express = require('express')
const dirRoot = require('./app/helpers/directory-root')
const database = require('./app/database/database')
const authRoute = require('./app/routes/auth-route')
const statusRoute = require('./app/routes/status-route')
const landingRoute = require('./app/routes/landing-route')

// - Express App

// - Constants

const maxWashCyclesWithoutCleaning = 5

// - Helpers

async function logWashCycle() {
  const insertResult = await washCollection.insertOne({
    type: 'wash',
    date: Date.now(),
  })
  console.log('Inserted wash documents =>', insertResult)
}

async function logCleanCycle() {
  const insertResult = await cleanCollection.insertOne({
    type: 'clean',
    date: Date.now(),
  })
  console.log('Inserted clean documents =>', insertResult)
}

async function numberOfWashCyclcesSinceLastCleaning() {
  const lastCleanCycle = await cleanCollection.find({}).sort({ date: -1 }).limit(1).toArray()

  if (lastCleanCycle[0] === null || lastCleanCycle.length == 0) {
    console.log('Returning all wash cycles')
    return await washCollection.count()
  } else {
    console.log('Returning filtered cycles')
    return await washCollection
      .find({
        date: {
          $gte: lastCleanCycle[0].date,
        },
      })
      .count()
  }
}

// - Express Configuration

const PORT = process.env.PORT || 8080
const app = express()

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.set('views', path.join(dirRoot(), 'app', 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(dirRoot(), 'app', 'public')))

// - Handling Requests

app.get('/', landingRoute.handleLandingGET)
// app.get('/auth', authRoute.handleIndexGET)
// app.get('/auth/login', authRoute.handleLoginGET)
// app.get('/auth/signup', authRoute.handleSignupGET)
// app.post('/auth/result', authRoute.handleAuthPOST)
// app.get('/status', statusRoute.handleStatusGET)

app.listen(PORT, async () => {
  await database.connectToDatabase()
  console.log(`Listening on localhost:${PORT}`)
})
