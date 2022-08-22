const getCurrentFilename = file => {
  const filename = file.split('/')
  if (filename.length > 0) {
    return filename[filename.length - 1]
  } else {
    return 'Ups! cannot resolve filename for this file'
  }
}

module.exports = {
  getCurrentFilename
}
