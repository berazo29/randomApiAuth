const { getUser } = require('./user')
const bcrypt = require('bcryptjs')

const loginInterface = (email, password, callback) => {
  getUser(email)
    .then(user => authenticatePassword(password)(user.password))
    .then(isOk => {
      if (isOk) {
        return callback(null, email)
      } else {
        return callback(null, [])
      }
    })
    .catch(error => callback(error))
}

const authenticatePassword = password => hash => {
  if (!password || !hash) return false
  return bcrypt.compareSync(password, hash)
}

module.exports = { loginInterface }
