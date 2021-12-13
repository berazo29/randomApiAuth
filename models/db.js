require('dotenv').config()
const mysql = require('mysql')
const Redis = require('ioredis')
const clientRedis = new Redis()

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
})

db.connect((err) => {
  if (err) throw err
  console.log('MySQL connected')
})

clientRedis.on('connect', () => {
  console.log('Redis connected')
})

module.exports = { db, clientRedis }