import '@babel/polyfill'
import { endpointAuthorizationTest } from '../utils'
import app from '../../src/api/app'
import supertest from 'supertest'
import defaults from 'superagent-defaults'
import {
  user as userModel,
  skill as skillModel,
  profileSkill as profileSkillModel
} from '../../src/db/models'
import { testUserToken, invalidToken } from './tokens'

const request = defaults(supertest(app))

const profileSkillEndpoint = '/api/profileskills/'

describe('API profileskills endpoint', () => {
  let profileSkills
  beforeAll(async () => {
    request.set('Accept', 'application/json')
    request.set('Authorization', `Bearer ${testUserToken}`)
    const [normalUser] = await userModel.findAll({ where: { admin: false } })
    const [react, nodeJs] = await skillModel.findAll()
    const nodeProfileSkill = {
      description: 'so node',
      knows: 2,
      profileId: normalUser.id,
      skillId: nodeJs.id,
      wantsTo: 3
    }

    const reactProfileSkill = {
      description: 'so node',
      knows: 4,
      profileId: normalUser.id,
      skillId: react.id,
      wantsTo: 5
    }
    profileSkills = [reactProfileSkill, nodeProfileSkill]
    await profileSkillModel.bulkCreate(profileSkills)
  })
  afterAll(async () => {
    await profileSkillModel.destroy({ where: {}, truncate: true, force: true })
  })

  describe('Fetching profile skills', () => {
    it('should allow authorized user to fetch all profileskills', async () => {
      const expectedProfileSkills = profileSkills
      const response = await request.get(profileSkillEndpoint).expect(200)
      expect(response.body.length).toBe(expectedProfileSkills.length)
      response.body.forEach((profileSkill, idx) => {
        expect(profileSkill).toMatchObject(expectedProfileSkills[idx])
      })
    })

    it('should allow authorized user to fetch specific profileskill', async () => {
      const [react] = await profileSkillModel.findAll()
      const response = await request.get(profileSkillEndpoint + react.id).expect(200)
      expect(response.body.id).toBe(react.id)
      expect(response.body.description).toBe(react.description)
      expect(response.body.skillId).toBe(react.skillId)
      expect(response.body.profileId).toBe(react.profileId)
      expect(response.body.wantsTo).toBe(react.wantsTo)
      expect(response.body.knows).toBe(react.knows)
    })
  })

  describe('Endpoint authorization', () => {
    request.set('Authorization', `Bearer ${invalidToken}`)
    endpointAuthorizationTest(request.request.get, '/api/profileSkills/')
    endpointAuthorizationTest(request.request.get, '/api/profileSkills/123')
  })
})
