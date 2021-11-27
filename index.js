const express = require('express')
const session = require('express-session')
require('dotenv').config()
const users = require('./users')
const { redirectLogin, redirectHome } = require('./controllers/auth')
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

const app = express()
const port = 3000

app.use(session({
  name: 'session',
  resave: true,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: Number(process.env.SESSION_MAX_AGE),
    sameSite: true,
    secure: process.env.NODE_ENV === 'production'
  }
}))
app.use(express.urlencoded({ extended: false }))

app.get('/', redirectLogin, (req, res) => {
  res.send('I am home')
})

app.post('/login', (req, res) => {
  res.send('I am login')
})

app.post('/register', redirectHome, (req, res) => {
  const { username, email, password } = req.body
  if (username && email && password) {
    const hash = bcrypt.hashSync(password, salt)
    users.push({ username, email, hash })
    req.session.userId = username
    res.redirect('/')
  } else {
    res.send('Missing fields')
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
