const { getUser, changeUserPassword, createUser, userExists } = require('./user')
const { isTokenValid, createOneTimeLink } = require('./auth/tokens')
const { hashPassword, authenticatePassword } = require('./auth/hasher')
const validator = require('validator')

const JWT_SECRET = process.env.JWT_SECRET

const loginInterface = (email, password, callback) => {
  getUser(email)
    .then(user => authenticatePassword(password)(user.password))
    .then(isAuthenticated => {
      if (isAuthenticated) {
        return callback(null, email)
      } else {
        return callback(null, '')
      }
    })
    .catch(error => callback(error))
}

const verifyTokenInterface = (email, token, callback) => {
  getUser(email)
    .then(user => {
      if (user === '') return false
      const uniqueSecret = JWT_SECRET + user.password
      return isTokenValid(token, uniqueSecret)
    })
    .then(result => callback(null, result))
    .catch(error => callback(error))
}

const changePasswordInterface = (email, newPassword, callback) => {
  getUser(email)
    .then(user => {
      if (user === '') return ''
      const hash = hashPassword(newPassword)
      return changeUserPassword(user.email, hash)
    })
    .then(result => callback(null, result))
    .catch(error => callback(error))
}

const sendResetPasswordInterface = (email, callback) => {
  getUser(email)
    .then(user => {
      if (user === '') return false
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
    .then(userCreated => { return callback(null, userCreated) })
    .catch(error => callback(error))
}

module.exports = { loginInterface, changePasswordInterface, sendResetPasswordInterface, verifyTokenInterface, registerUserInterface }
