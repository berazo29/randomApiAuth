require('dotenv').config()
const mysql = require('mysql2')
const Redis = require('ioredis')
const clientRedis = new Redis()

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
})

db.connect((err) => {
  if (err) throw err
  console.log('[mysql]: ok')
})

clientRedis.on('connect', () => {
  console.log('[redis]: ok')
})
clientRedis.on('error', (error) => {
  console.log('[redis]: ', error)
})

module.exports = { db, clientRedis }
