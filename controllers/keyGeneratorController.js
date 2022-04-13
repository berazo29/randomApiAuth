const uuid = require('uuid')
const { db, clientRedis } = require('../models/db')

const keyGenerator = () => {
  const DAYS_30 = 60 * 60 * 24 * 30
  const currentTime = Math.trunc(Date.now() / 1000)
  const expirationDate = currentTime + DAYS_30
  const v4 = uuid.v4()
  const key = {
    key: v4,
    exp_date: expirationDate,
    exp_time: DAYS_30,
    created_time: currentTime
  }
  return key
}

const generateNewKey = (req, res) => {
  const keyGen = keyGenerator()
  clientRedis.set(req.session.userId, keyGen.key, 'PX', keyGen.exp_time)
  const searchUseID = 'SELECT id FROM users WHERE email = ?'
  db.query(searchUseID, req.session.userId, (err, results) => {
    if (err) throw err
    const userId = results[0].id
    const sql = 'INSERT INTO keys_logs (`key`, user_id, issue, expire) VALUES (?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?))'
    const values = [keyGen.key, userId, keyGen.created_time, keyGen.exp_date]
    db.query(sql, values, (err, results) => {
      if (err) {
        console.log(err)
      }
      res.redirect('/')
    })
  })
}

const getKeys = (req, res) => {
  const sql = 'SELECT id FROM users WHERE email= ?'
  db.query(sql, req.session.userId, (err, results) => {
    if (err) throw err
    const userId = results[0].id
    const sql2 = 'SELECT `key` AS key_u4, expire as exp_time, issue AS created_time FROM keys_logs WHERE user_id = ?'
    db.query(sql2, userId, (err, results) => {
      if (err) throw err
      res.render('pages/home', { title: 'Home', keys: results })
    })
  })
}

module.exports = { generateNewKey, getKeys }
