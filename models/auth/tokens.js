const jwt = require('jsonwebtoken')

const isTokenValid = (token, secret) => {
  try {
    jwt.verify(token, secret)
    return true
  } catch (e) {
    return false
  }
}

const createOneTimeLink = (user, secret) => {
  const uniqueSecret = secret + user.password
  const payload = {
    email: user.email
  }
  const token = jwt.sign(payload, uniqueSecret, {
    expiresIn: '1m'
  })
  const link = `http://localhost:3000/auth/forgotPassword/${user.email}/${token}`
  return link
}

module.exports = { isTokenValid, createOneTimeLink }
