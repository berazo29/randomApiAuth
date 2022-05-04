const express = require('express')
const session = require('express-session')
require('dotenv').config()
const path = require('path')
const app = express()
const port = process.env.SERVER_PORT
const authRoute = require('./routes/authRoute')
const mainRoute = require('./routes/mainRoute')
const keyGeneratorRoute = require('./routes/keyGeneratorRoute')
const accountRoute = require('./routes/accountRoute')

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

app.use((req, res, next) => {
  res.locals.userId = req.session.userId
  next()
})

app.use('/', mainRoute)
app.use('/auth', authRoute)
app.use('/keyGenerator', keyGeneratorRoute)
app.use('/account', accountRoute)

const server = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})

module.exports = server
