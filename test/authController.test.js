// const { assert, expect } = require('chai')
const request = require('supertest')
const server = require('../index')
const { db, clientRedis } = require('../models/db')

describe('Authentication Integrated Test', () => {
  after(function () {
    // Closes database services and server after testing is completed
    server.close()
    db.end()
    clientRedis.disconnect()
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
