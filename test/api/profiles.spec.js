import { endpointAuthorizationTest } from '../utils'
import app from '../../src/api/app'
import supertest from 'supertest'
import defaults from 'superagent-defaults'
import { testUserToken, testAdminToken, invalidToken, createUserToken } from './tokens'
const { profile, user } = require('../../src/db/models')
const { profiles } = require('../mockData/mockUsers')

const request = defaults(supertest(app))

const profileEndpoint = '/api/profiles/'

let normalUser, adminUser

describe('API profile endpoint', () => {
  beforeAll(async () => {
    const userProfiles = await user.findAll()
    normalUser = userProfiles.filter((user) => !user.admin)
    adminUser = userProfiles.filter((user) => user.admin)
    request.set('Accept', 'application/json')
    const jwtToken = createUserToken({
      googleId: normalUser.googleId,
      userId: user.id,
      admin: user.admin,
      exp: Date.now() + 3600
    })
    request.set('Authorization', `Bearer ${jwtToken}`)
  })

  describe('Fetching profiles', () => {
    it('should allow authorized users to fetch profiles', async () => {
      const expectedProfiles = profiles
      const response = await request.get(profileEndpoint).expect(200)
      expect(response.body.length).toEqual(expectedProfiles.length)
      response.body.forEach((profile, idx) => {
        expect(profile).toMatchObject(expectedProfiles[idx])
      })
    })

    it('should allow authorized users to filter active and inactive profiles', () => {

    })

    it('should allow authorized users to fetch specific user', () => {

    })
  })

  describe('Creating profiles', () => {
    it('should allow authorized user to create profile', () => {

    })
  })

  describe('Updating profiles', () => {
    it('should allow authorized user to edit him/her own profile', () => {

    })

    it('should allow authorized user to add skill to their own profile', () => {

    })

    it('should allow authorized user to edit skills of their own profile', () => {

    })

    it('should allow admin to edit any profile', () => {

    })

    it('should allow admin to edit skills of any profile', () => {

    })
  })

  describe('Deleting profiles', () => {
    it('should not allow deleting profiles', () => {

    })
  })

  describe('Endpoint authorization', () => {
    request.set('Authorization', `Bearer ${invalidToken}`)

    endpointAuthorizationTest(request.request.get, '/api/profiles')
    endpointAuthorizationTest(request.request.post, '/api/profiles')

    endpointAuthorizationTest(request.request.get, '/api/profiles/all')
    endpointAuthorizationTest(request.request.get, '/api/profiles/1')
    endpointAuthorizationTest(request.request.put, '/api/profiles/1')

    endpointAuthorizationTest(request.request.get, '/api/profiles/1/skills')
    endpointAuthorizationTest(request.request.post, '/api/profiles/1/skills')

    endpointAuthorizationTest(request.request.get, '/api/profiles/1/skills/1')
    endpointAuthorizationTest(request.request.put, '/api/profiles/1/skills/1')
  })
})
