import { ObjectId } from 'bson'
import User from '../models/user'
import { collections } from './database.service'
import { hashPlaintextPassword } from './password.service'

/**
 * @throws {Error}
 */
export async function createNewUser(name: string, plaintextPassword: string): Promise<User> {
  const existingUser = await fetchExistingUser(name)
  if (existingUser) {
    throw 'A user with this name already exists. If you\'re it\'s owner, you can sign in'
  }

  const hashedPassword = await hashPlaintextPassword(plaintextPassword)
  const user = new User(name, hashedPassword)
  const result = await collections.users.insertOne(user)
  if (result) {
    user._id = result.insertedId
    return user
  } else {
    throw `Could not create new user with name ${name}`
  }
}

export async function fetchExistingUser(name: string): Promise<User> {
  return (await collections.users.findOne({ name: name })) as User
}

/**
 * @throws {Error}
 */
export async function updatePasswordForUser(user: User, newPlaintextPassword: string): Promise<User> {
  const newHashedPassword = await hashPlaintextPassword(newPlaintextPassword)
  const updatedUser = user
  updatedUser.passwordHash = newHashedPassword
  const updateResult = await collections.users.findOneAndUpdate({ _id: new ObjectId(user._id) }, updatedUser)
  if (updateResult.ok) {
    return updatedUser
  } else {
    throw `Could not update password for user ${user._id}`
  }
}
