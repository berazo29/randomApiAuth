const validator = require('validator')
const { loginInterface, registerUserInterface } = require('../models/auth/authModel')
const { sendResetPasswordInterface, changePasswordInterface, verifyTokenInterface } = require('../models/auth/authModel')
const _ = require('lodash')

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
  loginInterface(email, password, (error, results) => {
    if (error) return res.send('something went wrong while login')
    if (results.length > 0) {
      const user = _.first(results)
      req.session.userId = user.email
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
  registerUserInterface(email, password, (error, results) => {
    if (error) return res.send('something went wrong while registering')
    if (results.length > 0) {
      const user = _.first(results)
      req.session.userId = user.email
      res.redirect('/')
    } else {
      const error = 'Email is already registered, please go to login page'
      res.render('pages/register', { title: 'register', errors: [error], email: email })
    }
  })
}

const sendResetPassword = (req, res) => {
  const { email } = req.body
  const errors = []
  if (!email || !validator.isEmail(email)) {
    errors.push('Invalid email')
    return res.render('pages/auth/forgotPassword', { title: 'forgot password', errors: errors })
  }
  sendResetPasswordInterface(email, (error, result) => {
    if (error) {
      console.log(error)
    }
    console.log(`is email sent to '${email}' = ${result}`)
  })
  return res.render('pages/auth/forgotPasswordFeedback', { title: 'forgot password feedback' })
}

const verityToken = (req, res, next) => {
  const { email, token } = req.params
  verifyTokenInterface(email, token, (error, isValid) => {
    if (error) {
      console.log(error)
    }
    if (isValid) {
      res.render('pages/auth/resetPasswordForm', { title: 'reset password', email: email, errors: [] })
    } else {
      res.send('No valid token to change password')
    }
  })
}

const resetNewPassword = (req, res, next) => {
  const { email, token } = req.params
  const { password, password2 } = req.body
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
  if (!validator.isEmail(email)) {
    errors.push('Email is not valid')
  }
  if (!validator.isStrongPassword(password)) {
    errors.push('Password does not meet security checks.')
  }
  if (errors.length !== 0) {
    res.render('pages/auth/resetPasswordForm', { title: 'reset password', errors: errors, email: email })
    return
  }
  verifyTokenInterface(email, token, (error, isValid) => {
    if (error) {
      console.log(error)
    }
    if (isValid) {
      changePasswordInterface(email, password, (error, result) => {
        if (error) {
          console.log(error)
          res.send('There was an error when changing the password')
          return
        }
        if (result !== '') {
          return res.send('Password changed')
        }
        const msm = `Could not change the password for user = '${email}'`
        res.send(msm)
      })
    } else {
      res.send('No valid token to change password')
    }
  })
}

module.exports = { redirectLogin, redirectHome, logout, login, register, sendResetPassword, verityToken, resetNewPassword }
