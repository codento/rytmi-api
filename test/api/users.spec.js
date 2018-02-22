import fixtures from '../fixtures'
const app = require('../../api/app')
const request = require('supertest')(app)
const db = fixtures.db
const byId = (a, b) => a.id - b.id

beforeEach(done => fixtures.init(done))
afterEach(done => fixtures.drop(done))
afterAll(done => fixtures.close(done))

describe('Fetching Users', () => {
  it('should return all users', async () => {
    const all = await request
      .get('/api/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(all.body.sort(byId))
      .toMatchObject([db.user1, db.user2, db.user3].sort(byId))
  })

  it('should return user by id', async () => {
    const fetched = await request.get('/api/users/' + db.user1.id)
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
      'username': 'Test.User',
      'password': 'fadsf',
      'active': true,
      'admin': false
    }

    const saved = await request
      .post('/api/users')
      .send(user)
      .expect(201)
    expect(saved.body).toMatchObject(user)

    const fetched = await request.get('/api/users/' + saved.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body).toMatchObject(user)
  })

  it('should update user and return the updated user', async () => {
    const current = await request.get('/api/users/' + db.user1.id)
    const user = {
      'username': 'Test.User',
      'password': 'fadsf',
      'active': true,
      'admin': false
    }
    const new_ = await request
      .put('/api/users/' + db.user1.id)
      .send(user)
      .expect(200)
    expect(new_.body).toMatchObject(user)
    expect(new_.body).not.toMatchObject(current)
  })

  it('should ignore passed id attribute', async () => {
    const user = {
      id: 999999999,
      'username': 'Test.User',
      'password': 'fadsf',
      'active': true,
      'admin': false
    }

    const created = await request
      .post('/api/users')
      .send(user)
      .expect(201)
    expect(created.body.id).not.toBe(user.id)

    const fetched = await request
      .get('/api/users/' + created.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body.id).not.toBe(user.id)

    const updated = await request
      .put('/api/users/' + created.body.id)
      .send(user)
      .expect(200)
    expect(updated.body.id).not.toBe(user.id)

    const fetchedAgain = await request
      .get('/api/users/' + created.body.id)
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
      'username': 'Test.User',
      'password': 'fadsf',
      'active': true,
      'admin': false
    }

    const validationErrors = ['username must be unique']

    await request
      .post('/api/users')
      .send(user)
      .expect(201)

    const failed = await request
      .post('/api/users')
      .send(user)
      .expect(400)
    expect(failed.body.error.details).toEqual(validationErrors)
  })
})
