const { getUser, changeUserPassword } = require('./user')
const { isTokenValid, createOneTimeLink } = require('./auth/tokens')
const { hashPassword, authenticatePassword } = require('./auth/hasher')

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

module.exports = { loginInterface, changePasswordInterface, sendResetPasswordInterface, verifyTokenInterface }
