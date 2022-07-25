const { db } = require('./db')

const getUser = (email) => {
  return new Promise((resolve, reject) => {
    getUserByEmail(email, (error, results) => {
      if (error) return reject(error)
      return resolve(results)
    })
  })
}

const getUserByEmail = (email, callback) => {
  const sql = 'SELECT * FROM users WHERE email = ?'
  db.query(sql, email, (error, results) => {
    if (error) return callback(error)
    if (results.length !== 0) {
      return callback(null, results[0])
    }
    return callback(null, '')
  })
}

const changeUserPassword = (email, newPassword) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE users SET password = ? WHERE email = ?'
    db.query(sql, [newPassword, email], (error, result) => {
      if (error) return reject(error)
      return resolve(result)
    })
  })
}

module.exports = {
  getUser,
  changeUserPassword
}
