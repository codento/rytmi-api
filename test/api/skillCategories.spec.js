import supertest from 'supertest'
import defaults from 'superagent-defaults'
import { endpointAuthorizationTest } from '../utils'
import app from '../../src/api/app'
import { user as userModel, skillCategory as skillCategoriesModel } from '../../src/db/models'
import { createUserToken, invalidToken } from './tokens'
import { skillCategories } from '../mockData/mockSkills'

const request = defaults(supertest(app))
const skillCategoriesEndpoint = '/api/skillcategories/'

describe('API skillcategories endpoint', () => {
  let devOps
  beforeAll(async () => {
    const users = await userModel.findAll()
    const normalUser = users.filter((user) => user.admin === false).pop()
    request.set('Accept', 'application/json')
    const jwtToken = createUserToken({
      googleId: normalUser.googleId,
      userId: normalUser.id,
      admin: normalUser.admin,
      exp: Date.now() + 3600
    })
    request.set('Authorization', `Bearer ${jwtToken}`)
  })
  describe('Fetching skill categories', () => {
    it('should allow authorized user to fetch skill categories', async () => {
      const expectedSkillCategories = skillCategories
      const response = await request.get(skillCategoriesEndpoint).expect(200)
      expect(response.body.length).toBe(expectedSkillCategories.length)
      response.body.forEach((skillCategory, idx) => {
        expect(skillCategory).toMatchObject(expectedSkillCategories[idx])
      })
    })

    it('should allow authorized user to fetch specific skill category', async () => {
      const [, frontEndDev] = skillCategories
      const response = await request.get(skillCategoriesEndpoint + '2').expect(200)
      expect(response.body).toMatchObject(frontEndDev)
    })
  })

  describe('Creating skill categories', () => {
    it('should allow authorized user to create new skill categories', async () => {
      devOps = {
        title: 'DevOps',
        skillGroupId: 1
      }
      const response = await request.post(skillCategoriesEndpoint).send(devOps).expect(201)
      expect(response.body).toMatchObject(devOps)
      devOps.id = response.body.id
    })
  })

  describe('Updating skill categories', () => {
    it('should allow authorized user to update skill category', async () => {
      devOps.title = 'Development & Operations'
      const response = await request.put(skillCategoriesEndpoint + devOps.id)
        .send({ title: devOps.title }).expect(200)
      expect(response.body).toMatchObject(devOps)
    })
  })

  describe('Deleting skill categories', () => {
    it('should allow authorized user to delete skill category', async () => {
      await request.delete(skillCategoriesEndpoint + devOps.id).expect(204)
      const skillCategoriesInDb = await skillCategoriesModel.findAll()
      skillCategoriesInDb.forEach(skilLCategory => {
        expect(skilLCategory.title).not.toMatch(devOps.title)
      })
    })
  })

  describe('Validations', () => {
    it('should not allow to insert skill category without a name', async () => {
      const withOutName = {
        title: null,
        skillGroupId: 1
      }
      const response = await request.post(skillCategoriesEndpoint).send(withOutName).expect(400)
      expect(response.body.error.details).not.toBe(null)
    })

    it('should not allow to insert skill category with same name', async () => {
      const sameName = {
        title: skillCategories[0].title,
        skillGroupId: 1
      }
      const response = await request.post(skillCategoriesEndpoint).send(sameName).expect(400)
      expect(response.body.error.details).not.toBe(null)
    })

    it('should not allow to insert skill category without skill group id', async () => {
      const noSkillGroupId = {
        title: 'System administration',
        skillGroupId: null
      }
      const response = await request.post(skillCategoriesEndpoint).send(noSkillGroupId).expect(400)
      expect(response.body.error.details).not.toBe(null)
    })
  })

  describe('Endpoint authorization', () => {
    request.set('Authorization', `Bearer ${invalidToken}`)

    endpointAuthorizationTest(request.request.get, '/api/skillcategories')
    endpointAuthorizationTest(request.request.post, '/api/skillcategories')
    endpointAuthorizationTest(request.request.get, '/api/skillcategories/1')
    endpointAuthorizationTest(request.request.put, '/api/skillcategories/1')
    endpointAuthorizationTest(request.request.delete, '/api/skillcategories/1')
  })
})
