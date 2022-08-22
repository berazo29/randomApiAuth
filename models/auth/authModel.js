const { getUser, changeUserPassword, createUser, userExists } = require('../user')
const { isTokenValid, createOneTimeLink } = require('./tokens')
const { hashPassword, authenticatePassword } = require('./hasher')
const validator = require('validator')
const _ = require('lodash')
const JWT_SECRET = process.env.JWT_SECRET

const loginInterface = (email, password, callback) => {
  getUser(email)
    .then(results => {
      if (results.length > 0) {
        const user = _.first(results)
        return authenticatePassword(password)(user.passwordHash)
      }
      return false
    })
    .then(isAuthenticated => {
      if (isAuthenticated) {
        return callback(null, [{ email: email.toLowerCase() }])
      } else {
        return callback(null, [])
      }
    })
    .catch(error => callback(error))
}

const verifyTokenInterface = (email, token, callback) => {
  getUser(email)
    .then(results => {
      if (results.length === 0) {
        return false
      }
      const user = _.first(results)
      const uniqueSecret = JWT_SECRET + user.passwordHash
      return isTokenValid(token, uniqueSecret)
    })
    .then(result => callback(null, result))
    .catch(error => callback(error))
}

const changePasswordInterface = (email, newPassword, callback) => {
  if (typeof email !== 'string' || typeof newPassword !== 'string') {
    return callback(null, false)
  }
  if (!validator.isEmail(email)) {
    return callback(null, false)
  }
  if (!validator.isStrongPassword(newPassword)) {
    return callback(null, false)
  }
  getUser(email)
    .then(results => {
      if (results.length > 0) {
        const hash = hashPassword(newPassword)
        const user = _.first(results)
        return changeUserPassword(user.email, hash)
      }
      return false
    })
    .then(isChanged => callback(null, isChanged))
    .catch(error => callback(error))
}

const sendResetPasswordInterface = (email, callback) => {
  getUser(email)
    .then(results => {
      if (results.length === 0) {
        return false
      }
      const user = _.first(results)
      return sendResetEmail(user)
    })
    .then(isSent => {
      callback(null, isSent)
    })
    .catch(error => callback(error))
}

const sendResetEmail = (user) => {
  const link = createOneTimeLink(user, JWT_SECRET)
  console.log(link)
  return true
}

const registerUserInterface = (email, password, callback) => {
  if (!validator.isEmail(email)) {
    return callback(new Error('invalid string email format'))
  }
  if (!validator.isStrongPassword(password, { minLength: 10 })) {
    return callback(new Error('password is not Strong'))
  }
  userExists(email)
    .then(isUser => {
      if (!isUser) {
        const hash = hashPassword(password)
        return createUser(email, hash)
      }
      return false
    })
    .then(isUserCreated => {
      if (isUserCreated) {
        return callback(null, [{ email: email.toLowerCase() }])
      } else {
        return callback(null, [])
      }
    })
    .catch(error => callback(error))
}

module.exports = { loginInterface, changePasswordInterface, sendResetPasswordInterface, verifyTokenInterface, registerUserInterface }
