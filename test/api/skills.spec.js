import fixtures from '../fixtures'
const app = require('../../src/api/app')
const request = require('supertest')(app)
const db = fixtures.db

/*
beforeEach(done => fixtures.init(done))
afterEach(done => fixtures.drop(done))
afterAll(done => fixtures.close(done))
*/

describe('Test skills', () => {
  test('It should response 200 the GET method', () => {
    return request
      .get('/api/skills')
      .expect(200)
  })
  test('respond with json', () => {
    return request
      .get('/api/skills')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
  })
})

describe('Creating and updating skills', () => {
  it('should persist skill and return the created skill', async () => {
    const skill = {
      name: 'Progress 4GL',
      description: 'blah blah'
    }

    const created = await request
      .post('/api/skills')
      .send(skill)
      .expect(201)
    expect(created.body).toMatchObject(skill)

    const fetched = await request
      .get('/api/skills/' + created.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body).toMatchObject(created.body)
  })

  it('should update skill and return the updated skill', async () => {
    const skill = {
      name: 'Updated name for skill 1',
      description: 'Updated description for skill 1'
    }

    const updated = await request
      .put('/api/skills/' + db.skill1.id)
      .send(skill)
      .expect(200)
    expect(updated.body).toMatchObject(skill)

    const fetched = await request
      .get('/api/skills/' + db.skill1.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body).toMatchObject(updated.body)
  })

  it('should ignore passed id attribute', async () => {
    const skill = {
      id: 9999999,
      name: 'JSF 1.0',
      description: 'blah blah'
    }

    const created = await request
      .post('/api/skills')
      .send(skill)
      .expect(201)
    expect(created.body.id).not.toBe(skill.id)

    const fetched = await request
      .get('/api/skills/' + created.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body.id).not.toBe(skill.id)

    const updated = await request
      .put('/api/skills/' + created.body.id)
      .send(skill)
      .expect(200)
    expect(updated.body.id).not.toBe(skill.id)

    const fetchedAgain = await request
      .get('/api/skills/' + created.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetchedAgain.body.id).not.toBe(skill.id)
  })

  it('should not allow two skills with the same name', async () => {
    const skill = {
      name: 'Oracle Forms',
      description: 'blah blah'
    }

    const validationErrors = ['name must be unique']

    await request
      .post('/api/skills')
      .send(skill)
      .expect(201)

    const failed = await request
      .post('/api/skills')
      .send(skill)
      .expect(400)
    expect(failed.body.error.details).toEqual(validationErrors)
  })
})

describe('Testing data validation', () => {
  it('should return 400 with invalid data', async () => {
    const skill = {
      description: 'desc'
    }

    const created = await request
      .post('/api/skills/')
      .send(skill)
    expect(created.status).toBe(400)
  })

  it('should include mandatory fields in validation errors', async () => {
    const validationErrors = [
      'Skill.name cannot be null'
    ]

    const created = await request
      .post('/api/skills/')
      .send({})
    expect(created.status).toBe(400)
    expect(created.body.error.details).toMatchObject(validationErrors)
  })
})
