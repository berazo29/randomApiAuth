const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT))
const { db } = require('../models/db')
const validator = require('validator')

const registerNewUser = (req, res) => {
  const { email, password, password2 } = req.body
  const errors = []
  if (!email) {
    errors.push('Email cannot be empty.')
  }
  if (!password) {
    errors.push('Password cannot be empty.')
  }
  if (password !== password2) {
    errors.push('Passwords do not match.')
  }
  if (errors.length !== 0) {
    res.render('pages/register', { title: 'register', errors: errors })
    return
  }
  if (!validator.isEmail(email)) {
    errors.push('Email is not valid')
    res.render('pages/register', { title: 'register', errors: errors })
    return
  }
  if (!validator.isStrongPassword(password)) {
    errors.push('Password does not meet security checks.')
    res.render('pages/register', { title: 'register', errors: errors })
    return
  }

  const hash = bcrypt.hashSync(password, salt)
  const sql1 = 'SELECT * FROM users WHERE email = ?'
  const sql2 = 'INSERT INTO users (email, password) VALUES (?, ?)'
  const values = [email, hash]
  db.query(sql1, values[0], (err, results) => {
    if (err) throw err
    if (results.length !== 0) {
      errors.push('Email already taken.')
      res.render('pages/register', { title: 'register', errors: errors })
      return
    }
    db.query(sql2, values, (err, results) => {
      if (err) throw err
      req.session.userId = email
      res.redirect('/')
    })
  })
}

module.exports = { registerNewUser }
