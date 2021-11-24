const session = require('express-session')
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.json())
app.use(
  express.urlencoded({
    extended: false
  })
)

app.post('/login', (req, res) => {
  let {username, password} = req.body;
  if (username === null || username.length === 0) {
    res.send("Invalid username")
  }
  if (password === null || password.length === 0) {
    res.send("Invalid password")
  } 
  res.send('Welcome')
})

app.post('/register', (req, res) => {
  res.send('I am register')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
