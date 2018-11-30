import { generatePost, endpointAuthorizationTest } from '../utils'
import app from '../../src/api/app'
import supertest from 'supertest'
import defaults from 'superagent-defaults'
import { testUserToken, invalidToken } from './tokens'

const request = defaults(supertest(app))
const endpoint = '/api/skillcategories/'
const createSkillCategory = generatePost(request, endpoint)
const db = {}

beforeAll(async done => {
  request.set('Authorization', `Bearer ${testUserToken}`)
  request.set('Accept', 'application/json')

  db.skillCategory1 = await createSkillCategory({
    title: 'Waving hands',
    skillGroupId: 1
  })
  db.skillCategory2 = await createSkillCategory({
    title: 'Coding',
    skillGroupId: 1
  })
  done()
})

describe('Test skillcategories', () => {
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

describe('Creating and updating skillcategories', () => {
  it('should persist skillcategory and return the created skillcategory', async () => {
    const skillCategory = {
      title: 'Advanced multiplication',
      skillGroupId: 1
    }

    const created = await request
      .post(endpoint)
      .send(skillCategory)
      .expect(201)
    expect(created.body).toMatchObject(skillCategory)

    const fetched = await request
      .get(endpoint + created.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body).toMatchObject(created.body)
  })

  it('should update skillcategory and return the updated skillcategory', async () => {
    const skillCategory = {
      title: 'Waving legs',
      skillGroupId: 1
    }

    const updated = await request
      .put(endpoint + db.skillCategory1.id)
      .send(skillCategory)
      .expect(200)
    expect(updated.body).toMatchObject(skillCategory)

    const fetched = await request
      .get(endpoint + db.skillCategory1.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body).toMatchObject(updated.body)
  })

  it('should ignore passed id attribute', async () => {
    const skillCategory = {
      id: 9999999,
      title: 'Is this a category?',
      skillGroupId: 1
    }

    const created = await request
      .post(endpoint)
      .send(skillCategory)
      .expect(201)
    expect(created.body.id).not.toBe(skillCategory.id)

    const fetched = await request
      .get(endpoint + created.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body.id).not.toBe(skillCategory.id)

    const updated = await request
      .put(endpoint + created.body.id)
      .send(skillCategory)
      .expect(200)
    expect(updated.body.id).not.toBe(skillCategory.id)

    const fetchedAgain = await request
      .get(endpoint + created.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetchedAgain.body.id).not.toBe(skillCategory.id)
  })

  it('should not allow two skillcategories with the same title', async () => {
    const skillCategory = {
      title: 'Microshift stuff',
      skillGroupId: 1
    }

    const validationErrors = ['title must be unique']

    await request
      .post(endpoint)
      .send(skillCategory)
      .expect(201)

    const failed = await request
      .post(endpoint)
      .send(skillCategory)
      .expect(400)
    expect(failed.body.error.details).toEqual(validationErrors)
  })
})

describe('Testing data validation', () => {
  it('should return 400 with invalid data', async () => {
    const skillCategory = {
      titel: 'Title'
    }

    const created = await request
      .post(endpoint)
      .send(skillCategory)
    expect(created.status).toBe(400)
  })

  it('should include mandatory fields in validation errors', async () => {
    const validationErrors = [
      'SkillCategory.title cannot be null',
      'SkillCategory.skillGroupId cannot be null'
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

  endpointAuthorizationTest(request.request.get, '/api/skillcategories')
  endpointAuthorizationTest(request.request.post, '/api/skillcategories')
  endpointAuthorizationTest(request.request.get, '/api/skillscategories/1')
  endpointAuthorizationTest(request.request.put, '/api/skillscategories/1')
})
