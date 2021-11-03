const passwordHelpers = require('../helpers/password-helpers')
import { userCollection } from '../database/database'

export async function fetchUser(username) {
  const userDocument = await userCollection.findOne({
    username: username,
  })
  return userDocument
}

export async function createUser(username, plainTextPassword) {
  const encryptedPassword = await passwordHelpers.hashPlaintextPassword(plainTextPassword)
  const newUser = { username: username, passwordHash: encryptedPassword }
  return await userCollection.insertOne(newUser)
}
