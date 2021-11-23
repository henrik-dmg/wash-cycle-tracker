import User from '../models/user'
import { asyncQuery} from './database.service'
import { RequestContext } from 'express-openid-connect'
import { makeFindByNameQuery, makeFindByIDQuery } from '../helpers/query.helpers'

export async function createUser(context: RequestContext): Promise<User> {
  const user = context.user
  const databaseUser = new User(user.name, user.sub)
  const rows = await asyncQuery('INSERT INTO development_users SET ?', databaseUser)
  console.log(rows)
  return databaseUser
}

export async function deleteUser(userID: string) {
  const result = await asyncQuery(`DELETE FROM development_users WHERE id = '${userID}'`)
  console.log(result)
}

export async function fetchUserByName(name: string): Promise<User> {
  const rows = await asyncQuery(makeFindByNameQuery(name))
  console.log(rows)
  return rows[0] as User
}

export async function fetchUserByID(id: string): Promise<User> {
  const rows = await asyncQuery(makeFindByIDQuery(id))
  console.log(rows)
  return rows[0] as User
}