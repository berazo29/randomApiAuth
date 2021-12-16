const uuid = require('uuid')
const { db, clientRedis } = require('../models/db')

const keyGenerator = () => {
  /* const DAYS_30 = 1000 * 60 * 60 * 24 * 30 */
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
  console.log(req.session.userId)
  console.log(typeof (keyGen.key))
  console.log(typeof (keyGen.created_time))
  clientRedis.set(req.session.userId, keyGen.key, 'PX', keyGen.exp_time)
  const searchUseID = 'SELECT id FROM users WHERE email = ?'
  db.query(searchUseID, req.session.userId, (err, results) => {
    if (err) throw err
    const userID = results[0].id
    const sql = 'INSERT INTO keys_logs (key_u4, userId, created_time, exp_time) VALUES (?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?))'
    const values = [keyGen.key, userID, keyGen.created_time, keyGen.exp_date]
    db.query(sql, values, (err, results) => {
      if (err) {
        console.log(err)
      }
      res.send(keyGen)
    })
  })
}

const getKeys = (req, res) => {
  const sql = 'SELECT id FROM users WHERE email= ?'
  db.query(sql, req.session.userId, (err, results) => {
    if (err) throw err
    const userId = results[0].id
    const sql2 = 'SELECT * FROM keys_logs WHERE userId = ?'
    db.query(sql2, userId, (err, results) => {
      if (err) throw err
      console.log(results)
      res.render('pages/home', { title: 'Home', keys: results })
    })
  })
}

module.exports = { generateNewKey, getKeys }
