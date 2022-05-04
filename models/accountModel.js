const { db } = require('../models/db')

const getUserIdByEmail = (email) => {
    db.query('SELECT id FROM users WHERE email = ?', email, (error, results) => {
        if (error) return 0
        if (results.length !== 0 ) {
            return 
        }
    })
}  