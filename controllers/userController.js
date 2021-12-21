const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT))
const { db } = require('../models/db')
const validator = require('validator')

const registerNewUser = (req, res) => {
  const { email, password, password2 } = req.body
  if (!email || !password || !password2) {
    res.redirect('/auth/register')
    return
  }
  if (password !== password2) {
    res.redirect('/auth/register')
    return
  }

  if (!validator.isEmail(email) || !validator.isStrongPassword(password)) {
    res.redirect('/auth/register')
    return
  }

  const hash = bcrypt.hashSync(password, salt)
  const sql1 = 'SELECT * FROM users WHERE email = ?'
  const sql2 = 'INSERT INTO users (email, password) VALUES (?, ?)'
  const values = [email, hash]
  db.query(sql1, values[0], (err, results) => {
    if (err) throw err
    if (results.length !== 0) {
      res.redirect('/auth/login')
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
