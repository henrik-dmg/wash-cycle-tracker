import User from '../models/user'
import { asyncQuery} from './database.service'
import { RequestContext } from 'express-openid-connect'

export async function createNewDatabaseUser(context: RequestContext, machineID: number): Promise<User> {
  const user = context.user
  const databaseUser = new User(user.name, user.sub, machineID)
  const rows = await asyncQuery('INSERT INTO development_users SET ?', databaseUser)
  return rows[0] as User
}

export async function fetchExistingUser(name: string): Promise<User> {
  const rows = await asyncQuery(`SELECT * FROM development_users WHERE name = '${name}' LIMIT 1`)
  console.log(rows)
  return rows[0] as User
}

export async function fetchExistingUserByID(id: string): Promise<User> {
  const rows = await asyncQuery(`SELECT * FROM development_users WHERE id = '${id}' LIMIT 1`)
  console.log(rows)
  return rows[0] as User
}