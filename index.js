
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/login', (req, res) => {
  res.send('I am login')
})

app.post('/register', (req, res) => {
  res.send('I am register')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
