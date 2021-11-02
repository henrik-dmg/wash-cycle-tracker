const databaseSetup = require('../database/database.js')
const passwordHelpers = require('../helpers/password-helpers')

fetchUser = async (username) => {
  const userDocument = await databaseSetup.userCollection.findOne({
    username: username,
  })
  return userDocument
}

createUser = async (username, plainTextPassword) => {
  const encryptedPassword = await passwordHelpers.hashPlaintextPassword(plainTextPassword)
  const newUser = { username: username, passwordHash: encryptedPassword }
  return await databaseSetup.userCollection.insertOne(newUser)
}

module.exports = {
  fetchUser,
  createUser,
}
