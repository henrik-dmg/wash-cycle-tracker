import { Db, MongoClient, MongoClientOptions } from 'mongodb'
const projectConfig = require('../config/project-config')

const username = process.env.MONGODB_USER
const password = process.env.MONGODB_PASSWORD

if (username === undefined) {
  throw 'Username not set up'
}
if (password === undefined) {
  throw 'Password not set up'
}

export const databaseURL = `mongodb+srv://${username}:${password}@cluster0.ymy6f.mongodb.net/WashLogs?retryWrites=true&w=majority`

export const mongoClient = new MongoClient(databaseURL)
export const database: Db = mongoClient.db(projectConfig.projectName)
export const userCollection = database.collection('users')

export const connectToDatabase = async () => {
  await mongoClient.connect()
  console.log('Connected successfully to database server')
}
