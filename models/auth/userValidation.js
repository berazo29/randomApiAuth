const validator = require('validator')

const isValidUser = (user) => {
  if (typeof user === 'object') {
    if (user.email === undefined) return false
    if (user.password === undefined) return false
    return validator.isEmail(user.email)
  }
  return false
}

module.exports = { isValidUser }
