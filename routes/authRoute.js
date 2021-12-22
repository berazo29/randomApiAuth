const express = require('express')
const router = express.Router()
const { registerNewUser } = require('../controllers/userController')
const { redirectHome, logout, login } = require('../controllers/authController')

router.get('/register', redirectHome, (req, res) => {
  res.render('pages/register', {title: 'register'})
})

router.get('/login', redirectHome, (req, res) => {
  res.render('pages/login', {title: 'login'})
})

router.post('/register', redirectHome, registerNewUser)

router.post('/logout', logout, (req, res) => {
  res.redirect('/auth/login')
})

router.post('/login', redirectHome, login)

module.exports = router
