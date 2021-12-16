const express = require('express')
const router = express.Router()
const { redirectLogin } = require('../controllers/authController')
const { getKeys } = require('../controllers/keyGeneratorController')

router.get('/', redirectLogin, getKeys)

module.exports = router
