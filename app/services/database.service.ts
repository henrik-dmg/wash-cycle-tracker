import * as mongoDB from 'mongodb'
import * as mysql from 'mysql'

export const helpers: { databaseURL: string; database?: mongoDB.Db } = {
  databaseURL: `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.ymy6f.mongodb.net/WashLogs?retryWrites=true&w=majority`,
}
export const collections: { users?: mongoDB.Collection } = {}

export let sqlConnection: mysql.Connection

export async function connectToDatabase() {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(helpers.databaseURL.toString())

  await client.connect()

  const db: mongoDB.Db = client.db(process.env.MONGODB_DATABASE_NAME)
  helpers.database = db

  const usersCollection: mongoDB.Collection = db.collection(process.env.MONGODB_USERS_COLLECTION)
  collections.users = usersCollection

  console.log(`Successfully connected to database: ${db.databaseName} and collections: ${usersCollection.collectionName}`)

  const connection = mysql.createConnection({
    host: '91.204.46.68',
    user: 'k153557_henrik',
    password: '@kzoofzH-rs*wNNWu6guemCus**8zu',
  })

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack)
      return
    }
    sqlConnection = connection
    console.log('connected as id ' + connection.threadId)
  })
}
