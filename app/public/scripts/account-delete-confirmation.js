function promptForDeleteConfirmation() {
  if (confirm('Are you sure you want to delete your account?')) {
    console.log(document.cookie)
    // window.location.href = '../account/deleteAccount'
    console.log('Deleting account now...')
  } else {
    // Do nothing!
    console.log('That was a close one...')
  }
}