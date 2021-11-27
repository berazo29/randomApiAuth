const session = require('express-session')
const bcrypt = require('bcryptjs')
const express = require('express')
const mysql = require('mysql')
const path = require('path')
require('dotenv').config()
const app = express()
const port = 3000
const { redirectLogin, redirectHome } = require('./controllers/auth.js')

app.use(session({
  name: 'session',
  resave: true,
  saveUninitialized: false,
  secret: process.env.SECRET,
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

app.get('/login', (req, res) => {
  res.render('pages/login')
})

app.post('/login', redirectHome, (req, res) => {
  const { username, password } = req.body
  if (username === null || username.length === 0) {
    res.redirect('/login')
  }
  if (password === null || password.length === 0) {
    res.redirect('/login')
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
    res.redirect('/login')
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
