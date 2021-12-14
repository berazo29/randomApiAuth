const { db } = require('../models/db')
const bcrypt = require('bcryptjs')

const redirectHome = (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/')
  } else {
    next()
  }
}

const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/auth/login')
  } else {
    next()
  }
}

const logout = (req, res, next) => {
  req.session.destroy(() => {
    res.clearCookie('session')
    next()
  })
}

const login = (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.redirect('/auth/login')
    return
  }
  const sql = 'SELECT * FROM users WHERE email = ?'
  db.query(sql, email, (err, results) => {
    if (err) throw err
    if (results.length === 0) {
      res.redirect('/auth/register')
      return
    }
    if (bcrypt.compareSync(password, results[0].password)) {
      req.session.userId = email
      res.redirect('/')
      return
    }
    res.redirect('/auth/login')
  })
}

module.exports = { redirectLogin, redirectHome, logout, login }
