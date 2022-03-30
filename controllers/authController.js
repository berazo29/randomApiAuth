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
  const errors = []
  if (!email || !password) {
    if (!email) {
      errors.push('Email cannot be empty.')
    }
    if (!password) {
      errors.push('Password cannot be empty.')
    }
    res.render('pages/login', { title: 'login', errors: errors, email: email })
    return
  }
  const sql = 'SELECT * FROM users WHERE email = ?'
  db.query(sql, email, (err, results) => {
    if (err) throw err
    if (results.length === 0) {
      res.render('pages/register', { title: 'register', errors: errors, email: email })
      return
    }
    if (bcrypt.compareSync(password, results[0].password)) {
      req.session.userId = email
      res.redirect('/')
      return
    }
    errors.push('Password is not correct.')
    res.render('pages/login', { title: 'login', errors: errors, email: email })
  })
}

module.exports = { redirectLogin, redirectHome, logout, login }
