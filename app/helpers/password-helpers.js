const bcrypt = require('bcrypt')
const saltRounds = 10

hashPlaintextPassword = async (plaintextPassword) => {
  const encryptedPassword = await bcrypt.hash(plaintextPassword, saltRounds)
  if (encryptedPassword) {
    return encryptedPassword
  } else {
    throw 'Encrypted password was null or empty'
  }
}

checkPlaintextPassword = async (plaintextPassword, passwordHash) => {
  const match = await bcrypt.compare(plaintextPassword, passwordHash)
  if (match) {
    return true
  } else {
    return false
  }
}

module.exports = {
  hashPlaintextPassword,
  checkPlaintextPassword,
}
