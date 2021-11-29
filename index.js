const express = require('express')
const session = require('express-session')
require('dotenv').config()
const users = require('./users')
const { redirectLogin, redirectHome } = require('./controllers/auth')
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)
const mysql = require('mysql')
const path = require('path')
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

app.use(
  express.urlencoded({
    extended: true
  })
)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
})

db.connect((err) => {
  if (err) throw err
  console.log('MySQL connected')
})

app.get('/', redirectLogin, (req, res) => {
  res.send('I am home')
})

app.get('/auth/login', (req, res) => {
  res.render('pages/login')
})

app.post('/auth/login', redirectHome, (req, res) => {
  const { username, password } = req.body
  if (username === null || username.length === 0) {
    res.redirect('/auth/login')
  }
  if (password === null || password.length === 0) {
    res.redirect('/auth/login')
  }
  const sql = 'SELECT * FROM users WHERE username = ?'
  const values = [username, password]
  db.query(sql, values[0], (err, results) => {
    if (err) throw err
    if (results.length === 0) {
      return res.redirect('/register')
    }
    if (bcrypt.compareSync(password, results[0].password)) {
      req.session.userId = username
      return res.redirect('/')
    }
    res.redirect('/auth/login')
  })
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
  console.log('server running')
})
