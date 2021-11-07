const passwordHelpers = require('../helpers/password-helpers')
import { collections } from '../services/database.service'
import * as mongoDB from 'mongodb'

export async function fetchUser(username): Promise<mongoDB.Document> {
  const userDocument = await collections.users?.findOne({
    username: username,
  })
  return userDocument
}

export async function createUser(username, plainTextPassword): Promise<mongoDB.Document> {
  const encryptedPassword = await passwordHelpers.hashPlaintextPassword(plainTextPassword)
  const newUser = { username: username, passwordHash: encryptedPassword }
  return await collections?.users.insertOne(newUser)
}
