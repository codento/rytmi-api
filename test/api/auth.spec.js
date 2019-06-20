import '@babel/polyfill'
import supertest from 'supertest'
import app from '../../src/api/app'
import { user as userModel, profile as profileModel } from '../../src/db/models'
// Mocked google auth lib and user service
import * as gAuth from 'google-auth-library'

const request = supertest(app)
const authEndpoint = '/api/auth'

require('dotenv').config()

describe('API auth endpoint', () => {
  describe('Logging in', () => {
    let existingUser, createdUser
    beforeAll(async () => {
      ([existingUser] = await userModel.findAll({ where: { admin: false } }))
    })
    afterAll(async () => {
      await profileModel.destroy({ where: { userId: createdUser.id } })
      await userModel.destroy({ where: { googleId: createdUser.googleId } })
    })
    it('should return valid jwt for existing user', async () => {
      const users = await userModel.findAll()
      const expectedLength = users.length
      const googleAuthPayload = {
        sub: existingUser.googleId,
        hd: process.env.GOOGLE_ORG_DOMAIN,
        given_name: existingUser.firstName,
        family_name: existingUser.lastName,
        email: `${existingUser.firstName}.${existingUser.lastName}@codento.com`,
        picture: 'test-url/1234/s-96c/photo.jpg',
        exp: Math.round(Date.now()) + 36000
      }

      gAuth.__setMockPayload(googleAuthPayload)

      const response = await request
        .post(authEndpoint)
        .set('Accept', 'application/json')
        .send({ id_token: 'mocks.jwt.token' })
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Welcome to Rytmi app')
      const usersAfterLogin = await userModel.findAll()
      expect(usersAfterLogin.length).toBe(expectedLength)
    })

    it('should create new user if google id is not found', async () => {
      const users = await userModel.findAll()
      const expectedLength = users.length + 1
      const googleAuthPayload = {
        sub: '55556666',
        hd: process.env.GOOGLE_ORG_DOMAIN,
        given_name: 'Jorma',
        family_name: 'Nyberg',
        email: `jorma.nyberg@codento.com`,
        picture: 'test-url/1234/s-96c/photo.jpg',
        exp: Math.round(Date.now()) + 36000
      }

      gAuth.__setMockPayload(googleAuthPayload)

      const response = await request
        .post(authEndpoint)
        .set('Accept', 'application/json')
        .send({ id_token: 'mocks.jwt.token' })
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Welcome to Rytmi app')
      const usersAfterLogin = await userModel.findAll();
      ([createdUser] = usersAfterLogin.filter(user => user.googleId === googleAuthPayload.sub))
      expect(usersAfterLogin.length).toBe(expectedLength)
      expect(createdUser.firstName).toBe(googleAuthPayload.given_name)
      expect(createdUser.lastName).toBe(googleAuthPayload.family_name)
      const createdProfile = await profileModel.find({ where: { userId: createdUser.id } })
      expect(createdProfile.photoPath).toBe('test-url/1234/s-384c/photo.jpg')
    })

    it('should return 401 for foreign google domain', async () => {
      const googleAuthPayload = {
        sub: '4864318943578891',
        hd: 'foreign.com',
        given_name: 'Some',
        family_name: 'Foreigner',
        email: 'some@foreign.com'
      }
      gAuth.__setMockPayload(googleAuthPayload)

      await request
        .post('/api/auth')
        .set('Accept', 'application/json')
        .send({ id_token: 'mocks.jwt.token' })
        .expect('Content-Type', /json/)
        .expect(401)
    })

    it('should throw error when missing id token', async () => {
      const googleAuthPayload = {
        sub: existingUser.googleId,
        hd: process.env.GOOGLE_ORG_DOMAIN,
        given_name: existingUser.firstName,
        family_name: existingUser.lastName,
        email: `${existingUser.firstName}.${existingUser.lastName}@codento.com`,
        exp: Math.round(Date.now()) + 36000
      }

      gAuth.__setMockPayload(googleAuthPayload)

      const response = await request
        .post(authEndpoint)
        .set('Accept', 'application/json')
        .send({})
        .expect('Content-Type', /json/)
        .expect(401)
      expect(response.body.error.details).toBe('Missing client id')
    })
  })
})
