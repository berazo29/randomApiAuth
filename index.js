const express = require('express')
const session = require('express-session')
require('dotenv').config()
const { redirectLogin, redirectHome, logout } = require('./controllers/auth')
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)
const mysql = require('mysql')
const path = require('path')
const app = express()
const { keyGenerator } = require('./controllers/keyGenerator')
const port = process.env.SERVER_PORT
const Redis = require('ioredis');
const client = new Redis();
const auth = require('./routes/auth')

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





client.on('connect', () =>{
  console.log('Redis connected');
});

app.use('/auth', auth)

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

app.post('/logout', logout, (req, res) => {
  res.redirect('/auth/login')
})

app.post('/generateKey', /* redirectLogin,  */(req, res) => {
  const keyGen = keyGenerator();
  console.log(req.session.userId)
  client.set(req.session.userId, keyGen.key, 'PX', keyGen.exp_time)
  res.send(keyGen);
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
