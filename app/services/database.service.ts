import * as mongoDB from 'mongodb'
import * as dotenv from 'dotenv'

export const helpers: { databaseURL: string; database?: mongoDB.Db } = {
  databaseURL: `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.ymy6f.mongodb.net/WashLogs?retryWrites=true&w=majority`,
}
export const collections: { washingMachines?: mongoDB.Collection } = {}

export async function connectToDatabase() {
  dotenv.config()

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(helpers.databaseURL.toString())

  await client.connect()

  const db: mongoDB.Db = client.db(process.env.MONGODB_DATABASE_NAME)
  helpers.database = db

  const washingMachinesCollection: mongoDB.Collection = db.collection(process.env.MONGODB_WASHING_MACHINES_COLLECTION)
  collections.washingMachines = washingMachinesCollection

  console.log(`Successfully connected to database: ${db.databaseName} and collections: ${washingMachinesCollection.collectionName}`)
}
