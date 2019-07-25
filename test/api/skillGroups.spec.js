import '@babel/polyfill'
import supertest from 'supertest'
import defaults from 'superagent-defaults'
import { endpointAuthorizationTest } from '../utils'
import app from '../../src/api/app'
import { user as userModel, skillGroup as skillGroupModel } from '../../src/db/models'
import { createUserToken, invalidToken } from './tokens'
import { skillGroups } from '../mockData/mockSkills'

const request = defaults(supertest(app))
const skillGroupsEndpoint = '/api/skillgroups/'

describe('API skillcategories endpoint', () => {
  let agileMethods
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
    it('should allow authorized user to fetch skill groups', async () => {
      const expectedSkillGroups = skillGroups
      const response = await request.get(skillGroupsEndpoint).expect(200)
      expect(response.body.length).toBe(expectedSkillGroups.length)
      response.body.forEach((skillCategory, idx) => {
        expect(skillCategory).toMatchObject(expectedSkillGroups[idx])
      })
    })

    it('should allow authorized user to fetch specific skill groups', async () => {
      const [, softwareDevelopment] = skillGroups
      const response = await request.get(skillGroupsEndpoint + '2').expect(200)
      expect(response.body).toMatchObject(softwareDevelopment)
    })
  })

  describe('Creating skill categories', () => {
    it('should allow authorized user to create new skill groups', async () => {
      agileMethods = {
        title: { en: 'Agile methods', fi: 'Agilemetodit' }
      }
      const response = await request.post(skillGroupsEndpoint).send(agileMethods).expect(201)
      expect(response.body).toMatchObject(agileMethods)
      agileMethods.id = response.body.id
    })
  })

  describe('Updating skill categories', () => {
    it('should allow authorized user to update skill group', async () => {
      agileMethods.title = { en: 'Agile methods and practices', fi: 'Agilemetodit ja tavat' }
      const response = await request.put(skillGroupsEndpoint + agileMethods.id)
        .send({ title: agileMethods.title }).expect(200)
      expect(response.body).toMatchObject(agileMethods)
    })
  })

  describe('Deleting skill categories', () => {
    it('should allow authorized user to delete skill category', async () => {
      await request.delete(skillGroupsEndpoint + agileMethods.id).expect(204)
      const skillGroupsInDb = await skillGroupModel.findAll()
      skillGroupsInDb.forEach(skillCategory => {
        expect(skillCategory.title).not.toMatchObject(agileMethods.title)
      })
    })
  })

  describe('Validations', () => {
    it('should not allow to insert skill category without a name', async () => {
      const withOutName = {
        title: null
      }
      const response = await request.post(skillGroupsEndpoint).send(withOutName).expect(400)
      expect(response.body.error.details).not.toBe(null)
    })

    it('should not allow to insert skill category with same name', async () => {
      const sameName = {
        title: skillGroups[0].title
      }
      const response = await request.post(skillGroupsEndpoint).send(sameName).expect(400)
      expect(response.body.error.details).not.toBe(null)
    })
  })

  describe('Endpoint authorization', () => {
    request.set('Authorization', `Bearer ${invalidToken}`)
    endpointAuthorizationTest(request.request.get, '/api/skillgroups')
    endpointAuthorizationTest(request.request.post, '/api/skillgroups')
    endpointAuthorizationTest(request.request.get, '/api/skillgroups/1')
    endpointAuthorizationTest(request.request.put, '/api/skillgroups/1')
    endpointAuthorizationTest(request.request.delete, '/api/skillgroups/1')
  })
})
