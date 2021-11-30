import User from '../models/user'
import { asyncQuery} from './database.service'
import { RequestContext } from 'express-openid-connect'
import * as query from '../helpers/query.helpers'
import Machine from '../models/machine'

export async function createUser(context: RequestContext, machine: Machine): Promise<User> {
  const user = context.user
  const databaseUser = new User(user.name, user.sub, machine.id)
  const rows = await asyncQuery(query.makeInsertCodableQuery('development_users'), databaseUser)
  console.log(rows)
  return databaseUser
}

export async function deleteUser(userID: string) {
  const result = await asyncQuery(`DELETE FROM development_users WHERE id = '${userID}'`)
  console.log(result)
}

export async function fetchUserByName(name: string): Promise<User> {
  const rows = await asyncQuery(query.makeFindByNameQuery(name))
  console.log(rows)
  return rows[0] as User
}

export async function fetchUserByID(id: string): Promise<User> {
  const rows = await asyncQuery(query.makeFindByIDQuery(id))
  console.log(rows)
  return rows[0] as User
}