const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)
const { redirectLogin, redirectHome, logout } = require('../controllers/auth')
const {db }= require('../models/db')

router.post('/register', redirectHome, (req, res) => {
    const { email, password } = req.body
    if (email && password) {
        const hash = bcrypt.hashSync(password, salt)
        const sql1 = 'SELECT * FROM users WHERE email = ?'
        const sql2 = 'INSERT INTO users (email, password) VALUES (?, ?)'
        const values = [email, hash]
        db.query(sql1, values[0], (err, results) => {
        if (err) throw err
        if (results.length === 0) {
            db.query(sql2, values, (err, results) => {
            if (err) throw err
            req.session.userId = email
            res.redirect('/')
            })
        } else {
            res.redirect('/auth/login')
        }
        })
  } else {
    res.redirect('/auth/login')
  }
}
);


module.exports = router