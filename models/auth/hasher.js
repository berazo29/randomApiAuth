const bcrypt = require('bcryptjs')

const hash = rounds => password => {
  if (!rounds || typeof rounds !== 'number' || !parseInt(rounds)) throw new Error('rounds must be a natural number')
  if (!password || typeof password !== 'string') throw new Error('password must be a non-empty string')
  const salt = bcrypt.genSaltSync(rounds)
  return bcrypt.hashSync(password, salt)
}

const authenticatePassword = password => hash => {
  if (typeof password === 'string' && typeof hash === 'string') {
    return bcrypt.compareSync(password, hash)
  }
  return false
}

const hashPassword = hash(parseInt(process.env.BCRYPT_SALT) || 15)

module.exports = { hashPassword, authenticatePassword }
