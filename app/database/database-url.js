const credentials = require('../config/credentials')

module.exports = `mongodb+srv://${credentials.username}:${credentials.password}@cluster0.ymy6f.mongodb.net/WashLogs?retryWrites=true&w=majority`
