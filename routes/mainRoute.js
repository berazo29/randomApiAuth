const express = require('express')
const router = express.Router()
const { redirectLogin } = require('../controllers/authController')
const { getKeys } = require('../controllers/keyGeneratorController')

const key1 = {
  key: 'tttdoanfbsiIIiIibI',
  exp_date: new Date(Date.now() + 3600000).toString(),
  exp_time: (30).toString(),
  created_time: new Date(Date.now()).toString(),
}

const key2 = {
  key: 'doandoanfbsiIIiIibI',
  exp_date: new Date(Date.now() + 3600000).toString(),
  exp_time: (30).toString(),
  created_time: new Date(Date.now()).toString(),
}
const keys = [key1, key2]

router.get('/', redirectLogin, getKeys)

module.exports = router
