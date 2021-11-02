const { MongoClient } = require('mongodb')
const credentials = require('./database-url.js')
const projectConfig = require('../config/project-config')

const mongoClient = new MongoClient(credentials, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const database = mongoClient.db(projectConfig.projectName)
const userCollection = database.collection('users')
const washCollection = database.collection('wash-cycles')
const cleanCollection = database.collection('clean-cycles')

connectToDatabase = async () => {
  await mongoClient.connect()
  console.log('Connected successfully to database server')
}

module.exports = {
  mongoClient,
  database,
  userCollection,
  washCollection,
  cleanCollection,
  connectToDatabase,
}
