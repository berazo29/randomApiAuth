let app = null
const getApp = async () => {
  if (app) {
    return app
  }
  app = await require('../../index')
  return app
}

module.exports = {
  getApp
}
