const { loginInterface, registerUserInterface, changePasswordInterface } = require('../../models/auth/authModel')
const { expect } = require('chai')
const { db } = require('../../models/db')
const { hashPassword } = require('../../models/auth/hasher')
const _ = require('lodash')
const faker = require('@ngneat/falso')

describe('loginInterface', () => {
  const user = {
    email: 'test1232t3t4y3@mail.com',
    password: 'Strong@Password_123'
  }
  before((done) => {
    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)'
    const hash = hashPassword(user.password)
    db.query(sql, [user.email, hash], (error, result) => {
      if (error) return done(error)
      done()
    })
  })
  after((done) => {
    const sql = 'DELETE FROM users WHERE email = ?'
    db.query(sql, user.email, (error, result) => {
      if (error) return done(error)
      done()
    })
  })
  it('loginInterface with existing user and good password return [user] user = { email: string }', (done) => {
    loginInterface(user.email, user.password, (error, results) => {
      if (error) return done(error)
      expect(results).to.be.a('array').lengthOf(1)
      expect(_.first(results)).to.have.property('email').with.equal(user.email)
      done()
    })
  })
  it('loginInterface with existing user email uppercase and good password return [user] user = { email: string }', (done) => {
    const email = _.clone(user.email)
    loginInterface(email.toUpperCase(), user.password, (error, result) => {
      if (error) return done(error)
      expect(result).to.be.a('array')
      expect(result).to.have.lengthOf(1)
      expect(result[0]).to.have.property('email').with.equal(user.email)
      done()
    })
  })
  it('loginInterface with existing user email lowercase and good password return [user] user = { email: string }', (done) => {
    const email = _.clone(user.email)
    loginInterface(email.toLowerCase(), user.password, (error, result) => {
      if (error) return done(error)
      expect(result).to.be.a('array')
      expect(result).to.have.lengthOf(1)
      expect(result[0]).to.have.property('email').with.equal(user.email)
      done()
    })
  })
  it('loginInterface with existing user and empty password return []', (done) => {
    loginInterface(user.email, '', (error, result) => {
      if (error) return done(error)
      expect(result).to.be.a('array')
      expect(result).to.have.lengthOf(0)
      done()
    })
  })
  it('loginInterface with existing user and wrong password return []', (done) => {
    loginInterface(user.email, '1234', (error, result) => {
      if (error) return done(error)
      expect(result).to.be.a('array')
      expect(result).to.have.lengthOf(0)
      done()
    })
  })
  it('loginInterface with invalid user and password', (done) => {
    loginInterface('', '', (error, result) => {
      if (error) return done(error)
      expect(result).to.be.a('array')
      expect(result).to.have.lengthOf(0)
      done()
    })
  })
})

describe('registerInterface', () => {
  const newUser = {
    email: 'testuser122432463@mail.com',
    password: 'StrongPassword123@#'
  }
  afterEach((done) => {
    const sql = 'DELETE FROM users WHERE email = ?'
    db.query(sql, newUser.email, (error, result) => {
      if (error) {
        return done(error)
      }
      done()
    })
  })
  it('registerUserInterface with new user and strong password', (done) => {
    registerUserInterface(newUser.email, newUser.password, (error, result) => {
      if (error) return done(error)
      expect(result).to.be.a('array')
      expect(result).to.have.lengthOf(1)
      expect(result[0]).to.have.property('email').with.equal(newUser.email)
      done()
    })
  })
  it('registerUserInterface new user valid email and strong password', (done) => {
    registerUserInterface(newUser.email, newUser.password, (error, result) => {
      if (error) return done(error)
      expect(result).to.be.a('array')
      expect(result).to.have.lengthOf(1)
      expect(result[0]).to.have.property('email').with.equal(newUser.email)
      done()
    })
  })
})

describe('changePasswordInterface', () => {
  const user = {
    email: 'test123test@mail.com',
    password: 'Strong@Password_123'
  }
  beforeEach((done) => {
    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)'
    const hash = hashPassword(user.password)
    db.query(sql, [user.email, hash], (error, result) => {
      if (error) return done(error)
      done()
    })
  })
  afterEach((done) => {
    const sql = 'DELETE FROM users WHERE email = ?'
    db.query(sql, user.email, (error, result) => {
      if (error) return done(error)
      done()
    })
  })
  it('changePasswordInterface with valid email and strong password returns true', (done) => {
    changePasswordInterface(user.email, user.password, (error, result) => {
      if (error) return done(error)
      expect(result).to.be.a('boolean').equal(true)
      done()
    })
  })
  it('changePasswordInterface with valid email and empty password returns false', (done) => {
    const weakPassword = ''
    changePasswordInterface(user.email, weakPassword, (error, result) => {
      if (error) return done(error)
      expect(result).to.be.a('boolean').equal(false)
      done()
    })
  })
  it('changePasswordInterface with valid email and short weak password returns false', (done) => {
    const weakPassword = '1234'
    changePasswordInterface(user.email, weakPassword, (error, result) => {
      if (error) return done(error)
      expect(result).to.be.a('boolean').equal(false)
      done()
    })
  })
  it('changePasswordInterface with valid email and weak password returns false', (done) => {
    const weakPassword = '12345Password'
    changePasswordInterface(user.email, weakPassword, (error, result) => {
      if (error) return done(error)
      expect(result).to.be.a('boolean').equal(false)
      done()
    })
  })
  it('changePasswordInterface with empty user email and valid password returns false', (done) => {
    const emptyUser = ''
    changePasswordInterface(emptyUser, user.password, (error, result) => {
      if (error) return done(error)
      expect(result).to.be.a('boolean').equal(false)
      done()
    })
  })
  it('changePasswordInterface with not registered email and valid password returns false', (done) => {
    changePasswordInterface(faker.randEmail(), user.password, (error, result) => {
      if (error) return done(error)
      expect(result).to.be.a('boolean').equal(false)
      done()
    })
  })
})
