const { db } = require('../models/db')

const createProfile = (req, res) => {
  const email = req.session.userId
  const { name, lastname, country } = req.body
  if (!name || !lastname || !country) {
    res.send('Invalid name, lastname or country input')
    return
  }
  const userData = [name, lastname, country]
  db.query('SELECT id FROM users WHERE email = ?', email, (error, results) => {
    if (error) throw error
    if (results.length === 0) {
      res.send('users id was not found with this email')
      return
    }
    const userId = results[0].id
    db.query('SELECT * FROM users_profiles WHERE user_id = ?', userId, (error, results) => {
      if (error) throw error
      if (results.length !== 0) {
        res.send('profile already created')
        return
      }
      db.beginTransaction(error => {
        if (error) throw error
        db.query('INSERT INTO profiles (name, lastname, country) VALUES (?, ?, ?)', userData, (error, results) => {
          if (error) {
            return db.rollback(() => { throw error })
          }
          const profileId = results.insertId
          db.query('INSERT INTO users_profiles (profile_id, user_id) VALUES (?, ?)', [profileId, userId], (error, results) => {
            if (error) {
              return db.rollback(() => { throw error })
            }
            db.commit((error) => {
              if (error) {
                return db.rollback(() => { throw error })
              }
              res.send('Register successful')
            })
          })
        })
      })
    })
  })
}

const updateProfile = (req, res) => {
  res.send('update route')
}

module.exports = { createProfile, updateProfile }
