import { endpointAuthorizationTest } from '../utils'
import app from '../../src/api/app'
import supertest from 'supertest'
import defaults from 'superagent-defaults'
import { user as userModel, skill as skillModel } from '../../src/db/models'
import { skills } from '../mockData/mockSkills'
import { createUserToken, invalidToken } from './tokens'

const request = defaults(supertest(app))
const skillEndpoint = '/api/skills/'

describe('API Skills endpoint', () => {
  let normalUser
  beforeAll(async () => {
    const users = await userModel.findAll()
    normalUser = users.filter((user) => user.admin === false).pop()
    request.set('Accept', 'application/json')
    const jwtToken = createUserToken({
      googleId: normalUser.googleId,
      userId: normalUser.id,
      admin: normalUser.admin,
      exp: Date.now() + 3600
    })
    request.set('Authorization', `Bearer ${jwtToken}`)
  })
  afterAll(async () => {
    await skillModel.destroy({ where: { name: 'Java' } })
    const skillsInDb = await skillModel.findAll()
    expect(skillsInDb.length).toEqual(skills.length)
  })
  describe('Fetching skills', () => {
    it('should allow authorized user to fetch skills', async () => {
      const expectedSkills = skills
      const response = await request.get(skillEndpoint).expect(200)
      expect(response.body.length).toEqual(expectedSkills.length)
      expectedSkills.forEach((skill, idx) => {
        expect(response.body[idx]).toMatchObject(skill)
      })
    })

    it('should allow authorized user to fetch specific skill by id', async () => {
      const [react] = await skillModel.findAll({ where: { name: 'React' } })
      const response = await request.get(skillEndpoint + react.id).expect(200)
      expect(response.body.id).toEqual(react.id)
      expect(response.body.name).toEqual(react.name)
      expect(response.body.skillCategoryId).toEqual(react.skillCategoryId)
    })

    it('should allow authorized user to create new skill', async () => {
      const skill = {
        name: 'Java',
        description: 'Good \'ol java',
        skillCategoryId: 3
      }
      const response = await request.post(skillEndpoint).send(skill).expect(201)
      expect(response.body).toMatchObject(skill)
      const skillsResponse = await request.get(skillEndpoint).expect(200)
      expect(skillsResponse.body.length).toEqual(skills.length + 1)
    })

    it('should allow authorized user to edit existing skill', async () => {
      const [java] = await skillModel.findAll({ where: { name: 'Java' } })
      java.skillCategoryId = 1
      const attributes = { skillCategoryId: 1 }
      const response = await request.put(skillEndpoint + java.id).send(attributes).expect(200)
      expect(response.body.skillCategoryId).toEqual(java.skillCategoryId)
    })

    it('should allow authorized user to delete existing skill', async () => {
      const [java] = await skillModel.findAll({ where: { name: 'Java' } })
      await request.delete(skillEndpoint + java.id).expect(204)
      const skillsInDb = await skillModel.findAll()
      skillsInDb.forEach(skill => {
        expect(skill.id).not.toEqual(java.id)
        expect(skill.name).not.toEqual(java.name)
      })
    })

    it('should recreate old soft deleted skill when created again', async () => {
      const [java] = await skillModel.findAll({ where: { name: 'Java' }, paranoid: false })
      expect(java.deletedAt).not.toEqual(null)
      const skill = {
        name: 'Java',
        description: 'Good \'ol java again',
        skillCategoryId: 3
      }
      const response = await request.post(skillEndpoint).send(skill).expect(201)
      expect(response.body.id).toEqual(java.id)
      expect(response.body.name).toEqual(java.name)
      expect(response.body.description).toEqual(skill.description)
      expect(response.body.skillCategoryId).toEqual(skill.skillCategoryId)
    })
  })

  describe('skill validations', () => {
    it('should not allow skill without name', async () => {
      const skill = {
        name: null,
        description: 'Good \'ol java',
        skillCategoryId: 3
      }
      const response = await request.post(skillEndpoint).send(skill).expect(400)
      expect(response.body.error.details[0]).toEqual('skill.name cannot be null')
    })

    it('should not allow two skills with same name', async () => {
      const skill = {
        name: 'React',
        description: 'Good \'ol java',
        skillCategoryId: 3
      }
      const response = await request.post(skillEndpoint).send(skill).expect(400)
      expect(response.body.error.details[0]).toEqual('name must be unique')
    })

    it('should not allow skill without category', async () => {
      const skill = {
        name: 'C',
        description: 'Good \'ol java',
        skillCategoryId: null
      }
      const response = await request.post(skillEndpoint).send(skill).expect(400)
      expect(response.body.error.details[0]).toEqual('skill.skillCategoryId cannot be null')
    })

    it('should return 404 if fetched id does not exist', async () => {
      await request.get(skillEndpoint + '11111').expect(404)
    })
  })

  describe('Endpoint authorization', () => {
    request.set('Authorization', `Bearer ${invalidToken}`)
    endpointAuthorizationTest(request.request.get, '/api/skills')
    endpointAuthorizationTest(request.request.post, '/api/skills')
    endpointAuthorizationTest(request.request.get, '/api/skills/1')
    endpointAuthorizationTest(request.request.put, '/api/skills/1')
  })
})
