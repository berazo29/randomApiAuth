const { knex } = require('./db_connection')
const bcrypt = require('bcryptjs')

function createDataBase (dbname) {
  if (!dbname) {
    throw new Error('Undefined dbname variable')
  }
  return new Promise(resolve => {
    knex.raw('SELECT 1')
      .then(() => {
        console.log('MYSQL connected.')
        knex.raw(`DROP DATABASE IF EXISTS ${dbname}`)
          .then(() => {
            knex.raw(`CREATE DATABASE ${dbname}`)
              .then(() => {
                resolve(`Database '${dbname}' created successful.`)
              })
              .catch(e => { console.log(e) })
          })
      })
      .catch((e) => {
        console.log('MYSQL not connected')
        throw e
      })
  })
}

function createTables (dbname) {
  if (!dbname) {
    throw new Error('Undefined dbname variable')
  }
  return new Promise(resolve => {
    const jobs = []
    knex.schema.withSchema(dbname).createTable('users', function (table) {
      table.increments()
      table.string('email').notNullable().unique()
      table.string('password').notNullable()
      table.timestamp('created_at', { precision: 6 }).defaultTo(knex.fn.now(6))
      jobs.push('Table users created.')
    })
      .createTable('profiles', function (table) {
        table.increments()
        table.string('name', 100).notNullable()
        table.string('lastname', 100).notNullable()
        table.string('country', 100).notNullable()
        jobs.push('Table profiles created.')
      })
      .createTable('users_profiles', function (table) {
        table.integer('user_id').unsigned()
        table.integer('profile_id').unsigned()
        table.foreign('user_id').references('id').inTable('users')
        table.foreign('profile_id').references('id').inTable('profiles')
        jobs.push('Table users_profiles created.')
      })
      .createTable('keys_logs', table => {
        table.increments().unsigned()
        table.string('key_u4').notNullable()
        table.integer('user_id').unsigned()
        table.timestamp('created_time').notNullable()
        table.timestamp('exp_time').notNullable()
        table.foreign('user_id').references('id').inTable('users')
        jobs.push('Table keys_logs created.')
      })
      .then(() => {
        resolve(jobs)
      })
      .catch(e => { console.log(e) })
  })
}

function insertUserData (userData, data) {
  return new Promise(resolve => {
    const { email, password, name, lastname, country } = userData
    const hash = bcrypt.hashSync(password, data.bcryptSalt)
    knex('users').insert({
      email: email,
      password: hash
    }).withSchema(data.dbname)
      .then(() => {
        knex('profiles').withSchema(data.dbname).insert({
          name: name,
          lastname: lastname,
          country: country
        })
          .then(row => {
            const profileId = row[0]
            knex.select('id').table('users').where({ email: email }).withSchema(data.dbname)
              .then((row) => {
                knex('users_profiles').withSchema(data.dbname).insert({
                  profile_id: profileId,
                  user_id: row[0].id
                })
                  .then(() => {
                    resolve(`User data for ${email} populated on users, profile and users_profiles tables`)
                  })
                  .catch(e => { console.log(e) })
              })
          })
      })
  })
}

module.exports = { createTables, insertUserData, createDataBase }
