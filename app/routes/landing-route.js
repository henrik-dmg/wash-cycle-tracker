handleLandingGET = async (request, response) => {
  response.render('landing/index')
}

handleBannerTestGET = (request, response) => {
  response.render('landing/banner-test', {
    message: 'This is a test message',
    warning: 'This is a warning message',
    error: 'This is a error message',
  })
}

module.exports = {
  handleLandingGET,
  handleBannerTestGET,
}
