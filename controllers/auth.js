const redirectHome = (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/')
  } else {
    next()
  }
}

const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/auth/login')
  } else {
    next()
  }
}

module.exports = { redirectLogin, redirectHome }
