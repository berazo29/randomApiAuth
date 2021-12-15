const uuid = require('uuid')
const { db, clientRedis } = require('../models/db')


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

const getKeys = (req, res) => {
  const sql = 'SELECT id FROM users WHERE email= ?'
  db.query( sql, req.session.userId, (err, results) => {
    if (err) throw err
    const user_id = results[0].id
    const sql2 = 'SELECT * FROM keys_logs WHERE user_id = ?'
    db.query(sql2, user_id, (err, results) => {
      if (err) throw err
      res.render('pages/home', { title: 'Home', keys: results })
    })
  })
}


module.exports = { generateNewKey, getKeys }
