const request = require('supertest')
const helper = require('../../devtools/testUtils/appInstanceResolver')

describe('Authentication Integrated Test', () => {
  let server
  before((done) => {
    helper.getApp().then(app => {
      server = app
      done()
    })
  })
  describe('GET /auth/login', () => {
    it('should respond a login form', (done) => {
      request(server)
        .get('/')
        .redirects(1)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          return done()
        })
    })
    it('should login form should contain ', (done) => {
      request(server)
        .get('/auth/login')
        .redirects(1)
        .end((err, res) => {
          if (err) return done(err)
          return done()
        })
    })
  })
  describe('POST /auth/login', () => {
    it('should respond a login form', (done) => {
      request(server)
        .get('/')
        .redirects(1)
        .end((err, res) => {
          if (err) return done(err)
          return done()
        })
    })
  })
})
