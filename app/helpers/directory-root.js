const projectConfig = require('../config/project-config')

module.exports = () => {
  const directory = __dirname
  const components = directory.split('/')
  while (components[components.length - 1] != projectConfig.projectName && components.length != 0) {
    components.pop()
  }
  return components.reduce((prev, current) => `${prev}/${current}`)
}
