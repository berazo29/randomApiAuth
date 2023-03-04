let app = null
const sleep = (ms) => new Promise(resolve => { setTimeout(resolve, ms) })

const getApp = async () => {
  if (app) {
    return app
  }
  app = await require('../../index')
  await sleep(1000)
  return app
}

module.exports = {
  getApp
}
