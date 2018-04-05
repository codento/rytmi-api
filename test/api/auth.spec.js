import supertest from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../../src/api/app'
import logger from './../../src/api/logging'
import UserService from './../../src/services/users/index'

const request = supertest(app)

require('dotenv').config()

const userService = new UserService()

describe('Logging in', () => {
  it('should return a jwt for existing user', async () => {
    logger.debug('Creating user')
    const user = await userService.create({
      googleId: '456165135781687432435471',
      firstName: 'tupu',
      lastName: 'ankka',
      active: true,
      admin: true
    })
    logger.debug('User: ' + user)

    const googleAuthPayload = {
      sub: user.googleId,
      hd: process.env.GOOGLE_ORG_DOMAIN,
      given_name: 'Matt',
      family_name: 'Damon',
      email: 'matt@damon.com'
    }
    require('google-auth-library').__setMockPayload(googleAuthPayload)

    const response = await request
      .post('/api/auth')
      .set('Accept', 'application/json')
      .send({id_token: 'fdasf.fads.fadsfad'})
      .expect('Content-Type', /json/)
      .expect(200)
    expect(response.body.message).toBe('Welcome to Rytmi app')

    const token = response.body.jwt.token
    logger.debug('jwt token: ' + token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    logger.debug('decoded: ' + decoded)
    expect(decoded.googleId).toBe(user.googleId)
  })

  it('should create a new user if googleid not found', async () => {
    const payload = {
      sub: '1432178643217',
      hd: process.env.GOOGLE_ORG_DOMAIN,
      given_name: 'Al',
      family_name: 'Pacino',
      email: 'al@pacino.com'
    }
    require('google-auth-library').__setMockPayload(payload)

    const response = await request
      .post('/api/auth')
      .set('Accept', 'application/json')
      .send({id_token: 'fdasf.fads.fadsfad'})
      .expect('Content-Type', /json/)
      .expect(200)
    logger.debug('auth response: ' + JSON.stringify(response.body))

    expect(response.body.message).toBe('Welcome to Rytmi app')
    const decoded = jwt.verify(response.body.jwt.token, process.env.JWT_SECRET)
    const user = await userService.getByGoogleId(decoded.googleId)
    expect(user).not.toBe(null)
  })

  it('should return 401 for foreign google domain', async () => {
    const payload = {
      sub: '4864318943578891',
      hd: 'foreign.com',
      given_name: 'Some',
      family_name: 'Foreigner',
      email: 'some@foreign.com'
    }
    require('google-auth-library').__setMockPayload(payload)

    const response = await request
      .post('/api/auth')
      .set('Accept', 'application/json')
      .send({id_token: 'fdasf.fads.fadsfad'})
      .expect('Content-Type', /json/)
      .expect(401)
    console.log(response)
  })
})
