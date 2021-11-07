import bcrypt from 'bcrypt'
const saltRounds = 10

export async function hashPlaintextPassword(plaintextPassword): Promise<string> {
  const encryptedPassword = await bcrypt.hash(plaintextPassword, saltRounds)
  if (encryptedPassword) {
    return encryptedPassword
  } else {
    throw 'Encrypted password was null or empty'
  }
}

export async function checkPlaintextPassword(plaintextPassword, passwordHash): Promise<boolean> {
  const match = await bcrypt.compare(plaintextPassword, passwordHash)
  if (match) {
    return true
  } else {
    return false
  }
}
