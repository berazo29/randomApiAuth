const uuid = require('uuid')
const { clientRedis } = require('../models/db')

const keyGenerator = () => {
  const DAYS_30 = 1000 * 60 * 60 * 24 * 30
  const currentTime = Date.now()
  const expirationDate = new Date(currentTime + DAYS_30)
  const v4 = uuid.v4()
  const key = {
    key: v4,
    exp_date: expirationDate.toString(),
    exp_time: DAYS_30,
    created_time: currentTime
  }
  return key
}

const generateNewKey = (req, res) => {
  const keyGen = keyGenerator()
  console.log(req.session.userId)
  clientRedis.set(req.session.userId, keyGen.key, 'PX', keyGen.exp_time)
  res.send(keyGen)
}

module.exports = { generateNewKey }
