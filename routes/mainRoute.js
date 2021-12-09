const express = require('express')
const router = express.Router()
const { redirectLogin } = require('../Controllers/authController')

router.get('/', redirectLogin, (req, res) => {
  res.send('I am home')
})

module.exports = router
