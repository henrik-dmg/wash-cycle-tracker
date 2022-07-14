import type { NextPage } from 'next'

const AccountPage: NextPage = () => {
  return (
    <div>
      <h1>Account</h1>
      <p>This is the account page.</p>
      <a href="/api/auth/login">Login</a>
    </div>
  )
}

export default AccountPage
