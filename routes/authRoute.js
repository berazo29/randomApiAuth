const express = require('express')
const router = express.Router()
const { registerNewUser } = require('../controllers/userController')

const { redirectHome, logout } = require('../Controllers/authController')

router.get('/login', (req, res) => {
  res.render('pages/login')
})

router.post('/register', redirectHome, registerNewUser)

router.post('/logout', logout, (req, res) => {
  res.redirect('/auth/login')
})

router.post('/login', redirectHome, (req, res) => {
  res.send('I am login')
})

module.exports = router
