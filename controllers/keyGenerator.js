const uuid = require('uuid')

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

module.exports = { keyGenerator }
