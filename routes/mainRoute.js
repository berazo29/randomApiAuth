const express = require('express')
const router = express.Router()
const { redirectLogin } = require('../controllers/authController')
const { getKeys } = require('../controllers/keyGeneratorController')

router.get('/', redirectLogin, getKeys)
router.get('/our-term-and-conditions', (req, res) => {
  res.render('pages/legal/term-conditions', { title: 'Term and Conditions' })
})
router.get('/our-privacy-policy', (req, res) => {
  res.render('pages/legal/privacy-policy', { title: 'Privacy Policy' })
})

module.exports = router
