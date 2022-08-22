const chai = require('chai')
const expect = chai.expect
const { getCurrentFilename } = require('../../devtools/testUtils/filenameAutoResolver')
const { authenticatePassword } = require('../../models/auth/hasher')
const bcrypt = require('bcryptjs')

describe(getCurrentFilename(__filename), () => {
  describe('authenticatePassword', () => {
    it('it should return true when given valid password and hash ', () => {
      const password = 'Strong_@Password123'
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(password, salt)
      expect(authenticatePassword(password)(hash)).to.be.equal(true)
    })
    it('it should return true when given empty password and valid hash created with empty password', () => {
      const password = ''
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(password, salt)
      expect(authenticatePassword(password)(hash)).to.be.equal(true)
    })
    it('it should return false when given invalid hash', () => {
      const password = 'Strong_@Password123'
      const hash = 'invalidHash'
      expect(authenticatePassword(password)(hash)).to.be.equal(false)
    })
    it('it should return false when given invalid password types', () => {
      const password = 12345
      const hash = 'hash'
      expect(authenticatePassword(password)(hash)).to.be.equal(false)
    })
    it('it should return false when given invalid hash types', () => {
      const password = 'Strong_@Password123'
      const hash = 12345
      expect(authenticatePassword(password)(hash)).to.be.equal(false)
    })
    it('it should return false when given empty password', () => {
      const password = ''
      const hash = 'hash'
      expect(authenticatePassword(password)(hash)).to.be.equal(false)
    })
    it('it should return false when given empty hash', () => {
      const password = 'Strong_@Password123'
      const hash = ''
      expect(authenticatePassword(password)(hash)).to.be.equal(false)
    })
  })
})
