const express = require('express')
const router = express.Router()
const { redirectHome, logout, login, register } = require('../controllers/authController')

router.get('/register', redirectHome, (req, res) => {
  res.render('pages/register', { title: 'register', errors: [] })
})

router.get('/login', redirectHome, (req, res) => {
  res.render('pages/login', { title: 'login', errors: [] })
})

router.post('/register', redirectHome, register)

router.post('/logout', logout, (req, res) => {
  res.redirect('/auth/login')
})

router.post('/login', redirectHome, login)

module.exports = router
