const express = require('express')
const { createProfile, updateProfile } = require('../controllers/accountController')
const { redirectLogin } = require('../controllers/authController')
const { db } = require('../models/db')
const router = express.Router()

router.get('/profile', redirectLogin, (req, res) => {})

router.post('/createProfile', redirectLogin, createProfile, (req, res) => {})

router.post('/updateProfile', redirectLogin, updateProfile, (req, res) => {})

module.exports = router
