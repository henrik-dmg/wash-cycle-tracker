export enum AuthState {
  loggedIn = 'loggedIn',
  signedUp = 'signedUp',
  loggedOut = 'loggedOut',
  deletedAccount = 'deletedAccount',
  alreadySignedIn = 'alreadySignedIn',
  invalidCredentials = 'invalidCredentials',
}

export function bannerForAuthState(state: AuthState): unknown {
  switch (state) {
    case 'loggedIn':
      return { message: 'Successfully logged in' }
    case 'signedUp':
      return { message: 'Successfully created account' }
    case 'loggedOut':
      return { message: 'Logged out. Have a nice day' }
    case 'deletedAccount':
      return { message: 'Successfully deleted account. oki byeee' }
    case 'alreadySignedIn':
      return { warning: 'You\'re already signed in' }
    case 'invalidCredentials':
      return { error: 'Invalid credentials' }
    default:
      return null
  }
}