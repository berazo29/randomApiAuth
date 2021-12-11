require('dotenv').config()
const { knex } = require('./db_connection')
const { ENV_VARS_NEEDED, HELP_OPTIONS, showHelp } = require('./configuration')
const {
  createTables,
  insertUserData,
  createDataBase
} = require('./db_builder')

const {
  isIntegerString,
  loadSampleData,
  validatedEnvVariablesExists
} = require('./utils')

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
