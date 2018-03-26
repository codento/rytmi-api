import app from '../../src/api/app'
import supertest from 'supertest'
import defaults from 'superagent-defaults'
import testUserToken from './token'

const request = defaults(supertest(app))

beforeAll(async done => {
  request.set('Authorization', `Bearer ${testUserToken}`)
  request.set('Accept', 'application/json')
  done()
})

describe('Test the root api path', () => {
  test('It should response 200 the GET method', () => {
    return request
      .get('/api/')
      .expect(200)
  })
  test('respond with json', () => {
    return request
      .get('/api/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
  })
  test('includes version', async () => {
    const response = await request.get('/api/')
    expect(response.body).toHaveProperty('version')
  })
})
