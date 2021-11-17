import * as mysql from 'mysql'
import { promisify } from 'util'

export const sqlConnection = mysql.createConnection({
  host: '91.204.46.68',
  user: 'k153557_henrik',
  password: '@kzoofzH-rs*wNNWu6guemCus**8zu',
  database: 'k153557_washing_machine_server'
})

export const asyncQuery = promisify(sqlConnection.query).bind(sqlConnection)

export async function connectToDatabase() {
  sqlConnection.connect(function(err) {
    if (err) {
      console.error('Error connecting to SQL database: ' + err.stack)
      return
    }
    console.log('Connected to SQL database with Thread ID:' + sqlConnection.threadId)
  })
}
