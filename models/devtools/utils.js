const fs = require('fs')
const readline = require('readline')

function isIntegerString (str) {
  const n = Math.floor(Number(str))
  return n !== Infinity && String(n) === str && n >= 0
}

async function loadSampleData (filepath) {
  const fileStream = fs.createReadStream(filepath)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  const users = []
  for await (const line of rl) {
    const data = line.split(' ')
    if (data.length === 5) {
      const user = {
        email: data[0],
        password: data[1],
        name: data[2],
        lastname: data[3],
        country: data[4]
      }
      users.push(user)
    }
  }
  return users
}

function validatedEnvVariablesExists (envVarsNeeded) {
  const invalidVars = []
  for (const key in envVarsNeeded) {
    envVarsNeeded[key].forEach((i) => {
      if (process.env[i] === undefined) {
        invalidVars.push(i)
      }
    })
  }
  return invalidVars
}

module.exports = {
  isIntegerString,
  loadSampleData,
  validatedEnvVariablesExists
}
