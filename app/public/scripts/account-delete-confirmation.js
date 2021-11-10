function promptForDeleteConfirmation() {
  if (confirm('Are you sure you want to delete your account? This action can not be undone')) {
    // window.location.href = '../account/deleteAccount'
    console.log('Deleting account now...')
    window.location.replace('/account/deleteAccount')
  } else {
    // Do nothing!
    console.log('That was a close one...')
  }
}