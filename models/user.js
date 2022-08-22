const { db } = require('./db')
const _ = require('lodash')

const getUser = (email) => {
  return new Promise((resolve, reject) => {
    getUserByEmail(email, (error, results) => {
      const userList = []
      if (error) return reject(error)
      if (results.length > 0) {
        const user = {}
        const userData = _.first(results)
        user.email = userData?.email
        user.passwordHash = userData?.password
        user.createdOn = userData?.created_at
        userList.push(user)
      }
      return resolve(userList)
    })
  })
}

const getUserByEmail = (email, callback) => {
  const sql = 'SELECT * FROM users WHERE email = ?'
  db.query(sql, email, (error, results) => {
    if (error) return callback(error)
    return callback(null, results)
  })
}

const changeUserPassword = (email, hash) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE users SET password = ? WHERE email = ?'
    db.query(sql, [hash, email], (error, result) => {
      if (error) return reject(error)
      if (result?.changedRows) {
        return resolve(result.changedRows === 1)
      }
      return resolve(false)
    })
  })
}

const createUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)'
    db.query(sql, [email, password], (error, result) => {
      if (error) return reject(error)
      return resolve(result)
    })
  })
}

const userExists = (email) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id FROM users WHERE email = ?'
    db.query(sql, email, (error, results) => {
      if (error) return reject(error)
      if (results.length !== 0) {
        return resolve(true)
      }
      resolve(false)
    })
  })
}

module.exports = {
  getUser,
  createUser,
  userExists,
  changeUserPassword
}
