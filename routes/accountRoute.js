const express = require('express')
const { createProfile, updateProfile, profileView } = require('../controllers/accountController')
const { redirectLogin } = require('../controllers/authController')
const router = express.Router()

router.get('/profile', redirectLogin, profileView, (req, res) => {})

router.post('/createProfile', redirectLogin, createProfile, (req, res) => {})

router.post('/updateProfile', redirectLogin, updateProfile, (req, res) => {})

module.exports = router
