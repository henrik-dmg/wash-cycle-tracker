const { MongoClient } = require('mongodb')
const projectConfig = require('../config/project-config')

const databaseURL = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.ymy6f.mongodb.net/WashLogs?retryWrites=true&w=majority`
const mongoClient = new MongoClient(databaseURL, {
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
