const { db } = require('../models/db')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const { loginInterface } = require('../models/authModel')
const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT))

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
  loginInterface(email, password, (error, user) => {
    if (error) throw error
    if (user.length !== 0) {
      req.session.userId = email
      res.redirect('/')
    } else {
      errors.push('Password is not correct.')
      res.render('pages/login', { title: 'login', errors: errors, email: email })
    }
  })
}

const register = (req, res) => {
  const { email, password, password2, terms } = req.body
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
  if (!terms || terms !== 'on') {
    errors.push('Please agree with the Terms and Conditions and Privacy policy')
  }
  if (errors.length !== 0) {
    res.render('pages/register', { title: 'register', errors: errors, email: email })
    return
  }
  if (!validator.isEmail(email)) {
    errors.push('Email is not valid')
  }
  if (!validator.isStrongPassword(password)) {
    errors.push('Password does not meet security checks.')
  }
  if (errors.length !== 0) {
    res.render('pages/register', { title: 'register', errors: errors, email: email })
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

module.exports = { redirectLogin, redirectHome, logout, login, register }
