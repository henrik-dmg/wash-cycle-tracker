handleLandingGET = async (request, response) => {
  response.render('landing/index')
}

module.exports = {
  handleLandingGET,
}
