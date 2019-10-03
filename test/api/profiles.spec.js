import '@babel/polyfill'
import { endpointAuthorizationTest } from '../utils'
import app from '../../src/api/app'
import supertest from 'supertest'
import defaults from 'superagent-defaults'
import { invalidToken, createUserToken } from './tokens'
import {
  profile as profileModel,
  user as userModel,
  skill as skillModel,
  profileSkill as profileSkillModel,
  profileProject as profileProjectModel
} from '../../src/db/models'
import { profiles } from '../mockData/mockUsers'

const request = defaults(supertest(app))

const profileEndpoint = '/api/profiles/'

let normalUser, adminUser, normalUserProfileId

describe('API profile endpoint', () => {
  let profileProject
  beforeAll(async () => {
    const users = await userModel.findAll()
    normalUser = users.filter((user) => user.admin === false).pop()
    adminUser = users.filter((user) => user.admin === true).pop()
    request.set('Accept', 'application/json')
    const jwtToken = createUserToken({
      googleId: normalUser.googleId,
      userId: normalUser.id,
      admin: normalUser.admin,
      exp: Date.now() + 3600
    })
    normalUserProfileId = await profileModel.findOne({ where: {userId: normalUser.id} }).then(profile => {
      return profile.id
    })
    const firstProfileProject = {
      id: 3589,
      profileId: normalUserProfileId,
      projectId: 1,
      workPercentage: 100,
      role: { en: 'Something normal', fi: 'Normirooli' },
      startDate: new Date('2019-10-01').toISOString(),
      endDate: new Date('2019-10-31').toISOString()
    }
    profileProject = await profileProjectModel.create(firstProfileProject)
    request.set('Authorization', `Bearer ${jwtToken}`)
  })

  afterAll(async () => {
    await profileSkillModel.destroy({ where: {}, truncate: true, force: true })
    await profileProjectModel.destroy({ where: {id: 3589} })
  })

  describe('Fetching profiles', () => {
    it('should allow authorized users to fetch profiles', async () => {
      const expectedProfiles = profiles
      const response = await request.get(profileEndpoint).expect(200)
      response.body = response.body.map(profile => {
        delete profile.createdAt
        delete profile.updatedAt
        return profile
      })
      expect(response.body.length).toEqual(expectedProfiles.length)
      for (const profile of expectedProfiles) {
        expect(response.body).toContainEqual(expect.objectContaining(profile))
      }
    })

    it('should allow authorized users to filter active profiles', async () => {
      const expectedProfiles = profiles
      const response = await request.get(profileEndpoint).query({ active: true }).expect(200)

      expect(response.body.length).toEqual(expectedProfiles.length)
      for (const profile of response.body) {
        expect(response.body).toContainEqual(expect.objectContaining(profile))
      }
    })

    it('should allow authorized users to filter inactive profiles', async () => {
      const expectedProfiles = []
      const response = await request.get(profileEndpoint).query({ active: false }).expect(200)
      expect(response.body.length).toEqual(expectedProfiles.length)
      response.body.forEach((profile, idx) => {
        expect(profile).toMatchObject(expectedProfiles[idx])
      })
    })

    it('should allow authorized users to fetch specific user', async () => {
      const expectedProfile = profiles[1]
      const response = await request.get(profileEndpoint + normalUserProfileId).expect(200)
      expect(response.body).toMatchObject(expectedProfile)
    })
  })

  describe('Creating profiles', () => {
    it('should allow authorized user to create profile', async () => {
      // Create new user to db
      const user = {
        googleId: '1122334455',
        firstName: 'Some',
        lastName: 'User',
        active: true,
        admin: false
      }
      const userResponse = await request.post('/api/users').send(user)
      const userId = userResponse.body.id
      const newProfile = {
        userId: userId,
        firstName: 'Some',
        lastName: 'User',
        birthYear: 1985,
        email: 'some.user@codento.com',
        photoPath: 'from/somewhere',
        active: true
      }
      const profileResponse = await request.post(profileEndpoint).send(newProfile).expect(201)
      expect(profileResponse.body).toMatchObject(newProfile)
      // Clean created user and profile
      await profileModel.destroy({ where: { userId } })
      await userModel.destroy({ where: { id: userId } })
    })
  })

  describe('Updating profiles', () => {
    it('should allow authorized user to edit him/her own profile', async () => {
      const expectedProfile = profiles[1]
      expectedProfile.firstName = 'Hessu'
      const attributes = {
        id: normalUserProfileId,
        userId: normalUser.id,
        firstName: 'Hessu'
      }
      const response = await request.put(profileEndpoint + normalUserProfileId).send(attributes).expect(200)
      expect(response.body).toMatchObject(expectedProfile)
    })

    it('should allow authorized user to add skill to their own profile', async () => {
      const [nodeJs] = await skillModel.findAll()
      const profileSkill = {
        description: 'so node',
        knows: 0,
        profileId: normalUserProfileId,
        skillId: nodeJs.id,
        wantsTo: 0
      }
      const response = await request.post(profileEndpoint + normalUserProfileId + '/skills/')
        .send(profileSkill).expect(201)
      expect(response.body).toMatchObject(profileSkill)
    })

    it('should allow authorized user to fetch profile skills', async () => {
      const expectedProfileSkills = await profileSkillModel.findAll({ where: { profileId: normalUserProfileId } })
      const response = await request.get(profileEndpoint + normalUserProfileId + '/skills')
      expect(response.body.length).toEqual(expectedProfileSkills.length)
      expectedProfileSkills.forEach((profileSkill, idx) => {
        expect(profileSkill.id).toEqual(response.body[idx].id)
        expect(profileSkill.knows).toEqual(response.body[idx].knows)
        expect(profileSkill.wantsTo).toEqual(response.body[idx].wantsTo)
      })
    })

    it('should allow authorized user to edit skills of their own profile', async () => {
      const profileSkills = await profileSkillModel.findAll({ where: { profileId: normalUserProfileId } })
      const profileSkillToUpdate = {
        id: profileSkills[0].id,
        wantsTo: 3,
        knows: 5
      }
      const response = await request.put(profileEndpoint + normalUserProfileId + '/skills/' + profileSkillToUpdate.id)
        .send(profileSkillToUpdate)
        .expect(200)
      expect(response.body).toMatchObject(profileSkillToUpdate)
    })
    describe('Validating input', () => {
      it('should not allow two profiles with the same email', async () => {
        const attributes = {
          id: normalUserProfileId,
          userId: normalUser.id,
          email: profiles[0].email
        }
        await request.put(profileEndpoint + normalUserProfileId).send(attributes).expect(400)
        const unchangedProfile = await profileModel.findOne({ where: { userId: normalUser.id } })
        expect(unchangedProfile.email).toEqual(profiles[1].email)
      })

      it('should not allow two skill profiles for same skill', async () => {
        const [nodeJs] = await skillModel.findAll()
        const profileSkill = {
          description: 'so node',
          knows: 0,
          profileId: normalUserProfileId,
          skillId: nodeJs.id,
          wantsTo: 0
        }
        await request.post(profileEndpoint + normalUserProfileId + '/skills/')
          .send(profileSkill).expect(400)
      })

      it('should not allow to enter skill without mandatory fields missing', async () => {
        const validationErrors = [
          'profileSkill.skillId cannot be null',
          'profileSkill.knows cannot be null',
          'profileSkill.wantsTo cannot be null'
        ]

        const created = await request
          .post(profileEndpoint + normalUserProfileId + '/skills')
          .send({})
          .expect(400)
        expect(created.body.error.details).toMatchObject(validationErrors)
      })
    })

    describe('Updating as admin', () => {
      beforeAll(() => {
        const jwtToken = createUserToken({
          googleId: adminUser.googleId,
          userId: adminUser.id,
          admin: adminUser.admin,
          exp: Date.now() + 3600
        })
        request.set('Authorization', `Bearer ${jwtToken}`)
      })
      afterAll(() => {
        const jwtToken = createUserToken({
          googleId: normalUser.googleId,
          userId: normalUser.id,
          admin: normalUser.admin,
          exp: Date.now() + 3600
        })
        request.set('Authorization', `Bearer ${jwtToken}`)
      })

      it('should allow admin to edit any profile', async () => {
        const expectedProfile = profiles[1]
        expectedProfile.firstName = 'Mikki'
        const attributes = {
          id: normalUserProfileId,
          userId: normalUser.id,
          firstName: 'Mikki'
        }
        const response = await request.put(profileEndpoint + normalUserProfileId).send(attributes).expect(200)
        expect(response.body).toMatchObject(expectedProfile)
      })

      it('should allow admin to add skill to any profile', async () => {
        const [, react] = await skillModel.findAll()
        const profileSkill = {
          description: 'so node',
          knows: 2,
          profileId: normalUserProfileId,
          skillId: react.id,
          wantsTo: 2
        }
        const response = await request.post(profileEndpoint + normalUserProfileId + '/skills/')
          .send(profileSkill).expect(201)
        expect(response.body).toMatchObject(profileSkill)
      })

      it('should allow admin to edit skills of any profile', async () => {
        const profileSkills = await profileSkillModel.findAll({ where: { profileId: normalUserProfileId } })
        const profileSkillToUpdate = {
          id: profileSkills[0].id,
          wantsTo: 4,
          knows: 5
        }
        const response = await request.put(profileEndpoint + normalUserProfileId + '/skills/' + profileSkillToUpdate.id)
          .send(profileSkillToUpdate)
          .expect(200)
        expect(response.body).toMatchObject(profileSkillToUpdate)
      })

      it('should allow admin user to delete skill from any profile', async () => {
        const profileSkills = await profileSkillModel.findAll({ where: { profileId: normalUserProfileId } })
        await request.delete(profileEndpoint + normalUserProfileId + '/skills/' + profileSkills[0].id)
          .expect(204)
        const profileSkillsAfterDelete = await profileSkillModel.findAll({ where: { profileId: normalUserProfileId }, paranoid: true })
        expect(profileSkillsAfterDelete.length).toEqual(1)
        profileSkillsAfterDelete.forEach((profileSkill) => {
          expect(profileSkill.id).not.toEqual(profileSkills[0].id)
        })
      })
    })
  })

  it('should allow authorized user to delete skill from their profile', async () => {
    const profileSkills = await profileSkillModel.findAll({ where: { profileId: normalUserProfileId } })
    await request.delete(profileEndpoint + normalUserProfileId + '/skills/' + profileSkills[0].id)
      .expect(204)
    const profileSkillsAfterDelete = await profileSkillModel.findAll({ where: { profileId: normalUserProfileId }, paranoid: true })
    expect(profileSkillsAfterDelete.length).toEqual(0)
    profileSkillsAfterDelete.forEach((profileSkill) => {
      expect(profileSkill.id).not.toEqual(profileSkills[0].id)
    })
  })

  it('should recreate the profile skill if user is trying to add once deleted skill', async () => {
    const [react] = await profileSkillModel.findAll({ where: { profileId: normalUserProfileId }, paranoid: false })
    const profileSkill = {
      description: 'some skill',
      knows: 2,
      profileId: normalUserProfileId,
      skillId: react.id,
      wantsTo: 2
    }
    const response = await request.post(profileEndpoint + normalUserProfileId + '/skills')
      .send(profileSkill).expect(201)
    expect(response.body).toMatchObject(profileSkill)
  })

  it('should allow authorized users to fetch project profiles', async () => {
    const response = await request.get(profileEndpoint + normalUserProfileId + '/projects').expect(200)
    expect(response.body.length).toBe(1)
  })

  it('should allow authorized users to fetch specific project profile', async () => {
    const response = await request.get(profileEndpoint + normalUserProfileId + '/projects/' + profileProject.projectId).expect(200)
    expect(response.body.projectId).toEqual(profileProject.projectId)
    expect(response.body.profileId).toEqual(profileProject.profileId)
  })

  it('should return 404 for missing project profile', async () => {
    await request.get(profileEndpoint + normalUserProfileId + '/projects/123123').expect(404)
  })

  describe('Absences for profile endpoint', () => {
    it('allows authorized user to create absences for a profile', async () => {
      const users = await userModel.findAll()
      normalUser = users.filter((user) => user.admin === false).pop()
      const profile = await profileModel.findOne({ where: { userId: normalUser.id } })
      const absence = {
        endDate: '2019-09-04T00:00:00.000Z',
        leaveId: 1,
        startDate: '2019-09-01T00:00:00.000Z'
      }
      await request.post(`${profileEndpoint + profile.id}/absences`).send(absence)
      const response = await request.get(`${profileEndpoint + profile.id}/absences`)
      expect(response.body).toContainEqual(expect.objectContaining(absence))
    })
    it('allows authorized user to fetch and change an absence of a profile', async () => {
      const users = await userModel.findAll()
      normalUser = users.filter((user) => user.admin === false).pop()
      const profile = await profileModel.findOne({ where: { userId: normalUser.id } })
      const absences = await request.get(`${profileEndpoint + profile.id}/absences`)
      const oldAbsence = absences.body[0]
      const absence = {
        id: oldAbsence.id,
        profileId: oldAbsence.profileId,
        leaveId: 2
      }
      await request.put(`${profileEndpoint + profile.id}/absences/${oldAbsence.id}`).send(absence)
      const response = await request.get(`${profileEndpoint + profile.id}/absences`)
      expect(response.body).toContainEqual(expect.objectContaining(absence))
    })
    it('allows authorized user to delete an absence of a profile', async () => {
      const users = await userModel.findAll()
      normalUser = users.filter((user) => user.admin === false).pop()
      const profile = await profileModel.findOne({ where: { userId: normalUser.id } })
      const absences = await request.get(`${profileEndpoint + profile.id}/absences`)
      const oldAbsence = absences.body[0]
      const absence = {
        id: oldAbsence.id,
        profileId: oldAbsence.profileId,
        leaveId: 2
      }
      await request.delete(`${profileEndpoint + profile.id}/absences/${oldAbsence.id}`).send(absence).expect(204)
      const response = await request.get(`${profileEndpoint + profile.id}/absences/${oldAbsence.id}`).expect(404)
      expect(response.body).not.toContainEqual(expect.objectContaining(absence))
    })
  })

  describe('Endpoint authorization', () => {
    request.set('Authorization', `Bearer ${invalidToken}`)

    endpointAuthorizationTest(request.request.get, '/api/profiles')
    endpointAuthorizationTest(request.request.post, '/api/profiles')

    endpointAuthorizationTest(request.request.get, '/api/profiles/all')
    endpointAuthorizationTest(request.request.get, '/api/profiles/1')
    endpointAuthorizationTest(request.request.put, '/api/profiles/1')

    endpointAuthorizationTest(request.request.get, '/api/profiles/1/skills')
    endpointAuthorizationTest(request.request.post, '/api/profiles/1/skills')

    endpointAuthorizationTest(request.request.get, '/api/profiles/1/skills/1')
    endpointAuthorizationTest(request.request.put, '/api/profiles/1/skills/1')
  })
})
