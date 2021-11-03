const { MongoClient } = require('mongodb')
const projectConfig = require('../config/project-config')

const username = process.env.MONGODB_USER
const password = process.env.MONGODB_PASSWORD

if (username === undefined) {
  throw 'Username not set up'
}
if (password === undefined) {
  throw 'Password not set up'
}

const databaseURL = `mongodb+srv://${username}:${password}@cluster0.ymy6f.mongodb.net/WashLogs?retryWrites=true&w=majority`

const mongoClient = new MongoClient(databaseURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const database = mongoClient.db(projectConfig.projectName)
const userCollection = database.collection('users')

connectToDatabase = async () => {
  await mongoClient.connect()
  console.log('Connected successfully to database server')
}

module.exports = {
  mongoClient,
  database,
  userCollection,
  connectToDatabase,
}
