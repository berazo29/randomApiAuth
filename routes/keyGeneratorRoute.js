const express = require('express')
const router = express.Router()
const { generateNewKey } = require('../controllers/keyGeneratorController')
const { redirectLogin } = require('../Controllers/authController')

router.post('/generateKey', redirectLogin, generateNewKey)

module.exports = router
