const HELP_OPTIONS = {
  init: 'Create a new database. Note: If the database already exists, it will be dropped and a new database will be created.',
  populate: 'Load some samples into the database created.',
  '--help': 'Show help.'
}
const ENV_VARS_NEEDED = {
  db: ['DB_HOST', 'DB_NAME', 'DB_PORT', 'DB_USER', 'DB_PASSWORD'],
  bcrypt: ['BCRYPT_SALT']
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

module.exports = { HELP_OPTIONS, ENV_VARS_NEEDED, showHelp }
