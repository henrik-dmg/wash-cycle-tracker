export async function handleLandingGET(request, response) {
  response.render('landing/index')
}

export async function handleBannerTestGET(request, response) {
  response.render('landing/banner-test', {
    message: 'This is a test message',
    warning: 'This is a warning message',
    error: 'This is a error message',
  })
}
