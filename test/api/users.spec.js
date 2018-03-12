import { generatePost } from '../utils'
import app from '../../src/api/app'
import supertest from 'supertest'

const request = supertest(app)
const endpoint = '/api/users/'
const createUser = generatePost(request, endpoint)
const db = {}

beforeAll(async done => {
  db.user1 = await createUser({
    googleId: '123456',
    firstName: 'tupu',
    lastName: 'ankka',
    active: true,
    admin: true
  })
  db.user2 = await createUser({
    googleId: '234567',
    firstName: 'hupu',
    lastName: 'ankka',
    active: false,
    admin: false
  })
  db.user3 = await createUser({
    googleId: '345678',
    firstName: 'lupu',
    lastName: 'ankka',
    active: false,
    admin: false
  })
  done()
})

describe('Fetching Users', () => {
  it('should return all users', async () => {
    const all = await request
      .get(endpoint)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(all.body).toEqual(
      expect.arrayContaining([db.user1, db.user2, db.user3]))
  })

  it('should return user by id', async () => {
    const fetched = await request.get(endpoint + db.user1.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body).toMatchObject(db.user1)
  })

  it('should return 404 for invalid user id', () => {
    return request.get('/api/users/1000')
      .set('Accept', 'application/json')
      .expect(404)
  })
})

describe('Creating and updating users', () => {
  it('should persist and return new user', async () => {
    const user = {
      'googleId': "456789",
      'firstName': 'new',
      'lastName': 'user',
      'active': true,
      'admin': false
    }

    const saved = await request
      .post(endpoint)
      .send(user)
      .expect(201)
    expect(saved.body).toMatchObject(user)

    const fetched = await request.get(endpoint + saved.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body).toMatchObject(user)
  })

  it('should update user and return the updated user', async () => {
    const current = await request.get(endpoint + db.user1.id)
    const user = {
      'googleId': '123456',
      'firstName': 'Dewey',
      'lastName': 'updated',
      'active': true,
      'admin': false
    }
    const new_ = await request
      .put(endpoint + db.user1.id)
      .send(user)
      .expect(200)
    expect(new_.body).toMatchObject(user)
    expect(new_.body).not.toMatchObject(current)
  })

  it('should ignore passed id attribute', async () => {
    const user = {
      id: 999999999,
      'googleId': '45616234456',
      'firstName': 'ignoremyid',
      'lastName': 'fadsf',
      'active': true,
      'admin': false
    }

    const created = await request
      .post(endpoint)
      .send(user)
      .expect(201)
    expect(created.body.id).not.toBe(user.id)

    const fetched = await request
      .get(endpoint + created.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body.id).not.toBe(user.id)

    const updated = await request
      .put(endpoint + created.body.id)
      .send(user)
      .expect(200)
    expect(updated.body.id).not.toBe(user.id)

    const fetchedAgain = await request
      .get(endpoint + created.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetchedAgain.body.id).not.toBe(user.id)
  })

  it('should return 404 when updating invalid user id', () => {
    return request
      .put('/api/users/1000')
      .expect(404)
  })

  it('should not allow two users with the same username', async () => {
    const user = {
      'googleId': 'mustbeunique',
      'firstName': 'MrUnique',
      'lastName': 'adfasd',
      'active': true,
      'admin': false
    }

    const validationErrors = ['googleId must be unique']

    await createUser(user)

    const failed = await request
      .post(endpoint)
      .send(user)
      .expect(400)
    expect(failed.body.error.details).toEqual(validationErrors)
  })
})
