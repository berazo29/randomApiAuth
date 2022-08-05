const { isTokenValid } = require('../../models/auth/tokens')
const chai = require('chai')
const assert = chai.assert
const jwt = require('jsonwebtoken')

describe('Tokens.js', () => {
  describe('isTokenValid', () => {
    it('it should return false when given not inputs ', () => {
      assert.equal(isTokenValid(), false)
    })
    it('it should return false when token or secret are invalid ', () => {
      const token = '1245'
      const secret = 'secret'
      const test1 = isTokenValid(token, secret)
      assert.equal(test1, false)
    })
    it('it should return false when token cannot be verify with secret ', () => {
      const secret = 'secret'
      const token = jwt.sign({ foo: 'foo' }, 'secret1')
      const test1 = isTokenValid(token, secret)
      assert.equal(test1, false)
    })
    it('it should return false when token is expired', () => {
      const secret = 'secret'
      const token = jwt.sign({ foo: 'foo' }, secret, { expiresIn: '1' })
      const test1 = isTokenValid(token, secret)
      assert.equal(test1, false)
    })
    it('it should return true when token can be verify with secret ', () => {
      const secret = 'secret'
      const token = jwt.sign({ foo: 'foo' }, secret)
      const test1 = isTokenValid(token, secret)
      assert.equal(test1, true)
    })
  })
})
