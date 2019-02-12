import { endpointAuthorizationTest } from '../utils'
import app from '../../src/api/app'
import supertest from 'supertest'
import defaults from 'superagent-defaults'
import { testUserToken, invalidToken } from './tokens'
import { users } from '../mockData/mockUsers'
import { user } from '../../src/db/models'

const request = defaults(supertest(app))
const endpoint = '/api/users/'

describe('API Users endpoint', () => {
  beforeAll(() => {
    request.set('Authorization', `Bearer ${testUserToken}`)
    request.set('Accept', 'application/json')
  })

  afterAll(() => {
    return user.destroy({
      where: {
        firstName: 'Changed again'
      }
    })
  })

  describe('Fetching users', () => {
    it('should allow authorized user to fetch all users', async () => {
      const expectedUsers = users
      const response = await request
        .get(endpoint)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.length).toEqual(expectedUsers.length)
      response.body.forEach((user, idx) => {
        expect(user).toMatchObject(expectedUsers[idx])
      })
    })

    it('should allow authorized user to fetch user with id', async () => {
      const expectedUser = users[0]
      const response = await request.get(endpoint + 1)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body).toMatchObject(expectedUser)
    })

    it('should return 404 for authorized user when user does not exist', async () => {
      await request.get(endpoint + 123).expect(404)
    })
  })

  describe('Creating and updating users', () => {
    let userId = null

    it('should allow authorized user to create user', async () => {
      const user = {
        googleId: '112233',
        firstName: 'Created',
        lastName: 'User',
        active: true,
        admin: false
      }

      const response = await request.post(endpoint)
        .send(user)
        .expect('Content-Type', /json/)
        .expect(201)
      expect(response.body).toMatchObject(user)

      const { body } = await request.get(endpoint + response.body.id)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(body).toMatchObject(user)
      userId = body.id
    })

    it('should allow authorized user to update user', async () => {
      const user = {
        id: userId,
        googleId: '112233',
        firstName: 'Changed',
        lastName: 'User',
        active: true,
        admin: false
      }

      const response = await request.put(endpoint + userId)
        .send({ firstName: 'Changed' })
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body).toMatchObject(user)
    })

    it('id attribute sent should be ignored when updating user', async () => {
      const user = {
        id: userId,
        googleId: '112233',
        firstName: 'Changed again',
        lastName: 'User',
        active: true,
        admin: false
      }

      const response = await request.put(endpoint + userId)
        .send({ id: 10, firstName: 'Changed again' })
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body).toMatchObject(user)

      const { body } = await request.get(endpoint + response.body.id)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(body).toMatchObject(user)
    })

    it('should return 404 when updating invalid user id', () => {
      return request
        .put('/api/users/1000')
        .expect(404)
    })

    it('should not be able to insert two users with same google id', async () => {
      const user = {
        googleId: '112233',
        firstName: 'Failing insert',
        lastName: 'User',
        active: true,
        admin: false
      }

      const validationErrors = ['googleId must be unique']

      const response = await request.post(endpoint)
        .send(user)
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body.error.details).toEqual(validationErrors)
    })
  })

  describe('Testing authorization of endpoints', () => {
    request.set('Authorization', `Bearer ${invalidToken}`)
    endpointAuthorizationTest(request.request.get, '/api/users')
    endpointAuthorizationTest(request.request.post, '/api/users')
    endpointAuthorizationTest(request.request.get, '/api/users/1')
    endpointAuthorizationTest(request.request.put, '/api/users/1')
  })
})
