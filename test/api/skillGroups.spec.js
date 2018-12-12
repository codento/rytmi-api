import { generatePost, endpointAuthorizationTest } from '../utils'
import app from '../../src/api/app'
import supertest from 'supertest'
import defaults from 'superagent-defaults'
import { testUserToken, invalidToken } from './tokens'

const request = defaults(supertest(app))
const endpoint = '/api/skillgroups/'
const createSkillGroup = generatePost(request, endpoint)
const db = {}

beforeAll(async done => {
  request.set('Authorization', `Bearer ${testUserToken}`)
  request.set('Accept', 'application/json')

  db.skillGroup1 = await createSkillGroup({
    title: 'Man made tech'
  })
  db.skillGroup2 = await createSkillGroup({
    title: 'Alien made tech'
  })
  done()
})

describe('Test skillgroups', () => {
  test('It should response 200 the GET method', () => {
    return request
      .get(endpoint)
      .expect(200)
  })
  test('respond with json', () => {
    return request
      .get(endpoint)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
  })
})

describe('Creating and updating skillgroups', () => {
  it('should persist skillgroup and return the created skillgroup', async () => {
    const skillGroup = {
      title: 'Advanced alien tech'
    }

    const created = await request
      .post(endpoint)
      .send(skillGroup)
      .expect(201)
    expect(created.body).toMatchObject(skillGroup)

    const fetched = await request
      .get(endpoint + created.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body).toMatchObject(created.body)
  })

  it('should update skillgroup and return the updated skillgroup', async () => {
    const skillGroup = {
      title: 'Core fusion techs'
    }

    const updated = await request
      .put(endpoint + db.skillGroup1.id)
      .send(skillGroup)
      .expect(200)
    expect(updated.body).toMatchObject(skillGroup)

    const fetched = await request
      .get(endpoint + db.skillGroup1.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body).toMatchObject(updated.body)
  })

  it('should ignore passed id attribute', async () => {
    const skillGroup = {
      id: 9999999,
      title: 'Is this a Group?',
      skillGroupId: 1
    }

    const created = await request
      .post(endpoint)
      .send(skillGroup)
      .expect(201)
    expect(created.body.id).not.toBe(skillGroup.id)

    const fetched = await request
      .get(endpoint + created.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body.id).not.toBe(skillGroup.id)

    const updated = await request
      .put(endpoint + created.body.id)
      .send(skillGroup)
      .expect(200)
    expect(updated.body.id).not.toBe(skillGroup.id)

    const fetchedAgain = await request
      .get(endpoint + created.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetchedAgain.body.id).not.toBe(skillGroup.id)
  })

  it('should not allow two skillgroups with the same title', async () => {
    const skillGroup = {
      title: 'Oracle knowledge',
      skillGroupId: 1
    }

    const validationErrors = ['title must be unique']

    await request
      .post(endpoint)
      .send(skillGroup)
      .expect(201)

    const failed = await request
      .post(endpoint)
      .send(skillGroup)
      .expect(400)
    expect(failed.body.error.details).toEqual(validationErrors)
  })
})

describe('Testing data validation', () => {
  it('should return 400 with invalid data', async () => {
    const skillGroup = {
      tile: 'Title'
    }

    const created = await request
      .post(endpoint)
      .send(skillGroup)
    expect(created.status).toBe(400)
  })

  it('should include mandatory fields in validation errors', async () => {
    const validationErrors = [
      'skillGroup.title cannot be null'
    ]

    const created = await request
      .post(endpoint)
      .send({})
    expect(created.status).toBe(400)
    expect(created.body.error.details).toMatchObject(validationErrors)
  })
})

describe('Endpoint authorization', () => {
  request.set('Authorization', `Bearer ${invalidToken}`)

  endpointAuthorizationTest(request.request.get, '/api/skillgroups')
  endpointAuthorizationTest(request.request.post, '/api/skillgroups')
  endpointAuthorizationTest(request.request.get, '/api/skillsgroups/1')
  endpointAuthorizationTest(request.request.put, '/api/skillsgroups/1')
})
