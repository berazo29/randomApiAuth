const { db } = require('../models/db')

const getUserIdByEmail = (email, callback) => {
  const err = 0
  if (!email) {
    return callback(err)
  }
  db.query('SELECT id FROM users WHERE email = ?', email, (error, results) => {
    if (error || results.length === 0) {
      return callback(err)
    }
    return callback(results[0])
  })
}

module.exports = { getUserIdByEmail }
