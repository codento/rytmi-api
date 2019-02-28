import profileValidator from '../../src/validators/profile'
import customValidationError from '../../src/validators/customValidationError'

describe('Profile validators test suite', () => {
  describe('Url validator', () => {
    const profile = {
      links: []
    }
    it('should return true for valid profile links', () => {
      profile.links = ['http://moikka.net', 'http://jynkky.net']
      expect(() => profileValidator.validate(profile)).not.toThrow()
    })

    it('should throw Custom validation error', () => {
      profile.links = ['http://moikka.net', 'javascript:window.alert("tsajajaja")']
      expect(() => profileValidator.validate(profile)).toThrow(customValidationError)
    })
  })
})
