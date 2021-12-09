require('dotenv').config()
const bcrypt = require('bcryptjs')
const { ENV_VARS_NEEDED, HELP_OPTIONS } = require('./configuration')
const {
  isIntegerString,
  loadSampleData,
  validatedEnvVariablesExists
} = require('./utils')

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },
  pool: { min: 0, max: 7 }
})

async function runTasks () {
  const data = {}
  data.helpOptions = HELP_OPTIONS
  const args = process.argv.slice(2)
  if (args.length === 0 || args.find(e => e === '--help')) {
    await taskHandler('--help', data)
    return
  }
  const envVars = validatedEnvVariablesExists(ENV_VARS_NEEDED)
  if (envVars.length !== 0) {
    console.log(envVars)
    throw new Error('Undefined Environment Variables')
  }
  const invalidInput = []
  args.forEach(opt => {
    if (!(opt in data.helpOptions)) {
      invalidInput.push(opt)
    }
  })
  if (invalidInput.length !== 0) {
    console.log('Invalid inputs: ', invalidInput)
    await taskHandler('--help', data)
    return
  }
  data.userData = await loadSampleData('sampledata.txt')
  if (!isIntegerString(process.env.BCRYPT_SALT)) {
    throw new Error('Variable \'BCRYPT_SALT\' must be an Integer Number.')
  }
  data.bcryptSalt = Number(process.env.BCRYPT_SALT)
  data.dbname = process.env.DB_NAME
  for (const arg of args) {
    await taskHandler(arg, data)
  }
}

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
        table.integer('user_id').unsigned()
        table.timestamp('created_at').notNullable()
        table.timestamp('expire_at')
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

function showHelp (helpOptions) {
  console.log('Automatic Database building tool')
  console.log('Options:')
  Object.keys(helpOptions).forEach(key => {
    const n = Math.abs(15 - key.length)
    const spaces = Array(n).join(' ')
    console.log(`\t${key} ${spaces} ${helpOptions[key]}`)
  })
  console.log('Usage:')
  const argv = process.argv[1].split('/')
  const filename = argv.at(-1)
  console.log('\tnode', filename, '<option>')
}

async function taskHandler (task, data) {
  const status = []
  let resolve
  console.log(`Task '${task}' initiated.`)
  switch (task) {
    case 'init':
      resolve = await createDataBase(data.dbname)
      status.push(resolve)
      resolve = await createTables(data.dbname)
      status.push(...resolve)
      break
    case 'populate':
      for (const user of data.userData) {
        resolve = await insertUserData(user, data)
        status.push(resolve)
      }
      break
    case '--help':
      showHelp(data.helpOptions)
      break
    default:
      console.log('Use --help for usage guide.')
  }
  status.forEach(element => {
    console.log(element)
  })
  console.log(`Task '${task}' finished.`)
}

runTasks()
  .then(() => {
    knex.destroy()
      .then(() => {
        process.exit()
      })
  })
  .catch(e => {
    console.log(e)
  })
