const chai = require('chai')
const expect = chai.expect
const { getCurrentFilename } = require('../../devtools/testUtils/filenameAutoResolver')
const { hashPassword } = require('../../models/auth/hasher')
const { db } = require('../../models/db')
const faker = require('@ngneat/falso')
const _ = require('lodash')
const { getUser, userExists, changeUserPassword, createUser } = require('../../models/user')

describe(getCurrentFilename(__filename), () => {
  const userTest = {
    email: faker.randEmail(),
    password: (faker.randPassword({ size: 10 })).concat('1nN@')
  }
  before((done) => {
    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)'
    const hash = hashPassword(userTest.password)
    db.query(sql, [userTest.email, hash], (error, result) => {
      if (error) return done(error)
      // add user id to verify correct insert
      userTest.id = result.insertId
      done()
    })
  })
  after((done) => {
    const sql = 'DELETE FROM users WHERE email = ?'
    db.query(sql, userTest.email, (error, result) => {
      if (error) return done(error)
      done()
    })
  })
  describe('getUser', () => {
    it('getUser with valid email should return [{id, email, passwordHash, created}]', (done) => {
      getUser(userTest.email)
        .then(results => {
          const user = _.first(results)
          expect(results).to.be.a('array').lengthOf(1)
          expect(user).to.have.property('email').to.be.a('string').equal(userTest.email)
          expect(user).to.have.property('passwordHash').to.be.a('string')
          expect(user).to.have.property('createdOn').to.be.a('date')
          done()
        }).catch(error => done(error))
    })
    it('getUser not registered email should return []', (done) => {
      getUser(faker.randEmail())
        .then(results => {
          expect(results).to.be.a('array').lengthOf(0)
          done()
        }).catch(error => done(error))
    })
    it('getUser with empty email should return []', (done) => {
      getUser('')
        .then(results => {
          expect(results).to.be.a('array').lengthOf(0)
          done()
        }).catch(error => done(error))
    })
  })
  describe('userExits', () => {
    it('userExits when user email is registered return true', (done) => {
      userExists(userTest.email)
        .then(isUser => {
          expect(isUser).to.be.a('boolean').be.equal(true)
          done()
        })
        .catch(error => done(error))
    })
    it('userExits when user email is not registered return false', (done) => {
      userExists(faker.randEmail())
        .then(isUser => {
          expect(isUser).to.be.a('boolean').be.equal(false)
          done()
        })
        .catch(error => done(error))
    })
    it('userExits when user email is not empty return false', (done) => {
      userExists(faker.randEmail())
        .then(isUser => {
          expect(isUser).to.be.a('boolean').be.equal(false)
          done()
        })
        .catch(error => done(error))
    })
    it('userExits when invalid type input return false', (done) => {
      userExists(1234)
        .then(isUser => {
          expect(isUser).to.be.a('boolean').be.equal(false)
          done()
        })
        .catch(error => done(error))
    })
  })
  describe('changeUserPassword', (done) => {
    it('changeUserPassword with valid email and hash return true', () => {
      const hash = hashPassword(userTest.password)
      changeUserPassword(userTest.email, hash)
        .then(isPasswordChange => {
          expect(isPasswordChange).to.be.a('boolean').be.equal(true)
          done()
        })
        .catch(error => done(error))
    })
    it('changeUserPassword with valid email and empty hash return true', () => {
      changeUserPassword(userTest.email, '')
        .then(isPasswordChange => {
          expect(isPasswordChange).to.be.a('boolean').be.equal(true)
          done()
        })
        .catch(error => done(error))
    })
    it('changeUserPassword with not registered email and valid hash return false', () => {
      const hash = hashPassword(userTest.password)
      changeUserPassword(faker.randEmail(), hash)
        .then(isPasswordChange => {
          expect(isPasswordChange).to.be.a('boolean').be.equal(false)
          done()
        })
        .catch(error => done(error))
    })
    it('changeUserPassword with empty email and valid hash return false', () => {
      const hash = hashPassword(userTest.password)
      changeUserPassword('', hash)
        .then(isPasswordChange => {
          expect(isPasswordChange).to.be.a('boolean').be.equal(false)
          done()
        })
        .catch(error => done(error))
    })
  })
  describe('createUser', () => {
    const newUserTest = {
      email: faker.randEmail(),
      password: (faker.randPassword({ size: 10 })).concat('1nN@')
    }
    afterEach((done) => {
      const sql = 'DELETE FROM users WHERE email = ?'
      db.query(sql, newUserTest.email, (error, result) => {
        if (error) return done(error)
        done()
      })
    })
    it('createUser not registered email return true', () => {
      createUser(newUserTest.email).then(isSuccess => {
        expect(isSuccess).to.be.a('boolean').be.equal(true)
      })
    })
    it('createUser registered email return rejected promise with an error', () => {
      createUser(userTest.email)
        .catch(error => {
          expect(error?.code).to.be.a('string').be.equal('ER_DUP_ENTRY')
        })
    })
  })
})
