import { ManagementClient } from 'auth0'
import { promisify } from 'util'

export const managementClient = new ManagementClient({
  domain: 'panhans.eu.auth0.com',
  clientId: '1e0DHQsXVhHr72bTugjtmihz0GDhhJLJ',
  clientSecret: '_2rrNlTVrY_iDr8Ngko0iXAoj71JGdPT0c_dboa7BsBSGGHRJfRqis-lUbiiLCpB',
  scope: 'read:users update:users delete:users create:users'
})

export async function deleteAccountAndCascade(userID: string) {
  const deleteUserPromise = promisify(managementClient.deleteUser)
  try {
    await deleteUserPromise({ id: userID})
  } catch (error) {
    console.error(error)
  }
}