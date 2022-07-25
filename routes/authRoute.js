const express = require('express')
const router = express.Router()
const { redirectHome, logout, login, register, sendResetPassword, verityToken, resetNewPassword } = require('../controllers/authController')

router.get('/register', redirectHome, (req, res) => {
  res.render('pages/register', { title: 'register', errors: [] })
})

router.get('/login', redirectHome, (req, res) => {
  res.render('pages/login', { title: 'login', errors: [] })
})

router.get('/forgotPassword', redirectHome, (req, res) => {
  res.render('pages/auth/forgotPassword', { title: 'forgot password', errors: [] })
})

router.get('/forgotPassword/:email/:token', redirectHome, verityToken)

router.post('/forgotPassword/:email/:token', redirectHome, resetNewPassword)

router.post('/register', redirectHome, register)

router.post('/logout', logout, (req, res) => {
  res.redirect('/auth/login')
})

router.post('/login', redirectHome, login)

router.post('/forgotPassword', sendResetPassword)

module.exports = router
