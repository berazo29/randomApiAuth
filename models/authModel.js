const { getUser, changeUserPassword } = require('./user')
const bcrypt = require('bcryptjs')

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

const authenticatePassword = password => hash => {
  if (typeof password === 'string' && typeof hash === 'string') {
    return bcrypt.compareSync(password, hash)
  }
  return false
}

const hash = rounds => password => {
  if (!rounds || typeof rounds !== 'number') throw new Error('rounds must be an integer')
  if (!password || typeof password !== 'string') throw new Error('password must be a non-empty string')
  const salt = bcrypt.genSaltSync(rounds)
  return bcrypt.hashSync(password, salt)
}

const hashPassword = hash(parseInt(process.env.BCRYPT_SALT))

module.exports = { loginInterface, changePasswordInterface }
