const { isValidUser } = require('../../models/auth/userValidation')
const chai = require('chai')
const assert = chai.assert

describe('userValidator.js', () => {
  describe('isValidUser', () => {
    it('it should return false when undefined or not an object ', () => {
      assert.equal(isValidUser(), false)
    })
    it('it should return false when user.email or user.password undefined ', () => {
      const user1 = {}
      const user2 = { email: '' }
      const user3 = { password: '' }
      const test1 = isValidUser(user1)
      const test2 = isValidUser(user2)
      const test3 = isValidUser(user3)
      assert.equal(test1, false)
      assert.equal(test2, false)
      assert.equal(test3, false)
    })
    it('it should return false when user.email is not an email', () => {
      const user1 = { email: '', password: '' }
      const user2 = { email: undefined, password: '' }
      const user3 = { email: 'test', password: '' }
      const user4 = { email: 'test@', password: '' }
      const user5 = { email: 'test.com', password: '' }
      const test1 = isValidUser(user1)
      const test2 = isValidUser(user2)
      const test3 = isValidUser(user3)
      const test4 = isValidUser(user4)
      const test5 = isValidUser(user5)

      assert.equal(test1, false)
      assert.equal(test2, false)
      assert.equal(test3, false)
      assert.equal(test4, false)
      assert.equal(test5, false)
    })
    it('it should return true when user has email and password defined and email is valid', () => {
      const user1 = { email: 'test@mail.com', password: '' }
      const user2 = { email: 'test12@m.com', password: '' }
      const user3 = { email: 'test@123.net', password: '' }
      const test1 = isValidUser(user1)
      const test2 = isValidUser(user2)
      const test3 = isValidUser(user3)

      assert.equal(test1, true)
      assert.equal(test2, true)
      assert.equal(test3, true)
    })
  })
})
