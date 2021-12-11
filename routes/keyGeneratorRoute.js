const express = require('express')
const router = express.Router()
const { generateNewKey } = require('../controllers/keyGeneratorController')
const { redirectLogin } = require('../controllers/authController')

router.post('/generateKey', redirectLogin, generateNewKey)

module.exports = router
