import supertest from 'supertest'
import defaults from 'superagent-defaults'
import { endpointAuthorizationTest } from '../utils'
import app from '../../src/api/app'
import { createUserToken, invalidToken, testAdminToken } from './tokens'
import {
  user as userModel,
  project as projectModel,
  projectProfile as ppModel
} from '../../src/db/models'
import { projects } from '../mockData/mockProjects'

const request = defaults(supertest(app))

const projectEndpoint = '/api/projects/'

describe('API Projects endpoint', () => {
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
    await ppModel.destroy({ where: {}, truncate: false })
  })

  describe('Fetching projects', () => {
    it('should allow authorized users to fetch projects', async () => {
      const expectedProjects = projects
      const response = await request.get(projectEndpoint).expect(200)
      expect(response.body.length).toEqual(expectedProjects.length)
      response.body.forEach((project, idx) => {
        expect(project).toMatchObject(expectedProjects[idx])
      })
    })

    it('should allow authorized user to fetch specific project', async () => {
      const [reactProject] = projects
      const expectedProject = await projectModel.findOne({ where: { name: reactProject.name } })
      const response = await request.get(projectEndpoint + expectedProject.id).expect(200)
      expect(response.body).toMatchObject(reactProject)
    })
  })
  describe('Creating projects', () => {
    it('should allow authorized user to create a project', async () => {
      const leanWorkshop = {
        code: 1010,
        name: 'Lean workshop',
        startDate: new Date('2019-02-20').toISOString(),
        endDate: new Date('2019-02-20').toISOString(),
        description: 'Lean workshop for customer'
      }
      const response = await request.post(projectEndpoint).send(leanWorkshop).expect(201)
      expect(response.body).toMatchObject(leanWorkshop)
    })

    it('should allow authorized user to create a project without end date', async () => {
      const refactoringCode = {
        code: 1050,
        name: 'Refactoring old code',
        startDate: new Date('2019-02-20').toISOString(),
        description: 'This should be continuous'
      }
      const response = await request.post(projectEndpoint).send(refactoringCode).expect(201)
      expect(response.body).toMatchObject(refactoringCode)
    })
  })

  describe('Updating projects', () => {
    it('should allow authorized user to edit project', async () => {
      const [reactProject] = projects
      const expectedProject = await projectModel.findOne({ where: { name: reactProject.name } })
      reactProject.name = 'Address app for lost'
      expectedProject.name = 'Address app for lost'
      const response = await request.put(projectEndpoint + expectedProject.id).send(reactProject).expect(200)
      expect(response.body).toMatchObject(reactProject)
    })
  })

  describe('Project profiles', () => {
    let reactProjectId, onGoingProjectId
    let reactProjectProfile, onGoingProjectProfile

    beforeAll(async () => {
      const [reactProject, onGoingProject] = await projectModel.findAll()
      reactProjectId = reactProject.id
      onGoingProjectId = onGoingProject.id
      reactProjectProfile = {
        profileId: normalUser.id,
        projectId: reactProjectId,
        workPercentage: 100,
        startDate: new Date('2019-10-01').toISOString(),
        endDate: new Date('2019-10-31').toISOString()
      }
      onGoingProjectProfile = {
        profileId: normalUser.id,
        projectId: onGoingProjectId,
        workPercentage: 100,
        startDate: new Date('2019-11-03').toISOString(),
        endDate: new Date('2019-11-30').toISOString()
      }
    })

    describe('Creating project profiles', () => {
      it('should allow authorized user to add themself to a project', async () => {
        const response = await request.post(projectEndpoint + reactProjectId + '/profiles/' + normalUser.id)
          .send(reactProjectProfile).expect(201)
        expect(response.body).toMatchObject(reactProjectProfile)
      })

      it('should allow admin to add any user to a project', async () => {
        // Set admin token
        request.set('Authorization', `Bearer ${testAdminToken}`)
        const response = await request.post(projectEndpoint + onGoingProjectId + '/profiles/' + normalUser.id)
          .send(onGoingProjectProfile).expect(201)
        expect(response.body).toMatchObject(onGoingProjectProfile)
        // Set normal token after test
        const jwtToken = createUserToken({
          googleId: normalUser.googleId,
          userId: normalUser.id,
          admin: normalUser.admin,
          exp: Date.now() + 3600
        })
        request.set('Authorization', `Bearer ${jwtToken}`)
      })
    })

    describe('Fetching project profiles', () => {
      it('should allow authorized user to fetch any project\'s profiles', async () => {
        const expectedProjectProfiles = [reactProjectProfile]
        const response = await request.get(projectEndpoint + reactProjectId + '/profiles').expect(200)
        expect(response.body.length).toBe(expectedProjectProfiles.length)
        response.body.forEach((projectProfile, idx) => {
          expect(projectProfile).toMatchObject(expectedProjectProfiles[idx])
        })
      })

      it('should allow authorized user to fetch any project\'s specific profile', async () => {
        const expectedProjectProfile = reactProjectProfile
        const response = await request.get(projectEndpoint + reactProjectId + '/profiles/' + reactProjectProfile.profileId).expect(200)
        expect(response.body).toMatchObject(expectedProjectProfile)
      })
    })
  })

  describe('Validations', () => {
    describe('projects', () => {
      const leanWorkshop = {
        code: 1010,
        name: 'Lean workshop',
        startDate: new Date('2019-02-20').toISOString(),
        endDate: new Date('2019-02-20').toISOString(),
        description: 'Lean workshop for customer'
      }

      it('Should return 400 if name is empty or null', async () => {
        const noName = Object.assign({}, leanWorkshop)
        noName.name = null
        const response = await request.post(projectEndpoint).send(noName).expect(400)
        expect(response.body.error.details).not.toBe(null)
      })

      it('Should return 400 if name is not unique', async () => {
        const notUniqueName = Object.assign({}, leanWorkshop)
        notUniqueName.code = 1013
        const response = await request.post(projectEndpoint).send(notUniqueName).expect(400)
        expect(response.body.error.details).not.toBe(null)
      })

      it('Should return 400 if code is null', async () => {
        const noCode = Object.assign({}, leanWorkshop)
        noCode.code = null
        const response = await request.post(projectEndpoint).send(noCode).expect(400)
        expect(response.body.error.details).not.toBe(null)
      })

      it('Should return 400 if code is negative', async () => {
        const negativeCode = Object.assign({}, leanWorkshop)
        negativeCode.code = -13
        const response = await request.post(projectEndpoint).send(negativeCode).expect(400)
        expect(response.body.error.details).not.toBe(null)
      })

      it('Should return 400 if code is not unique', async () => {
        const sameCode = Object.assign({}, leanWorkshop)
        sameCode.name = 'Some other workshop'
        const response = await request.post(projectEndpoint).send(sameCode).expect(400)
        expect(response.body.error.details).not.toBe(null)
      })

      it('Should return 400 if startDate is null', async () => {
        const noStartDate = Object.assign({}, leanWorkshop)
        noStartDate.startDate = null
        const response = await request.post(projectEndpoint).send(noStartDate).expect(400)
        expect(response.body.error.details).not.toBe(null)
      })

      it('Should return 400 if startDate is after endDate', async () => {
        const startDateAfterEnd = Object.assign({}, leanWorkshop)
        startDateAfterEnd.startDate = new Date('2019-01-02')
        startDateAfterEnd.endDate = new Date('2019-01-01')
        const response = await request.post(projectEndpoint).send(startDateAfterEnd).expect(400)
        expect(response.body.error.details).not.toBe(null)
      })
    })
  })

  describe('Endpoint authorization', () => {
    request.set('Authorization', `Bearer ${invalidToken}`)

    endpointAuthorizationTest(request.request.get, '/api/projects')
    endpointAuthorizationTest(request.request.post, '/api/projects')

    endpointAuthorizationTest(request.request.get, '/api/projects/1')
    endpointAuthorizationTest(request.request.put, '/api/projects/1')
    endpointAuthorizationTest(request.request.delete, '/api/projects/1')

    endpointAuthorizationTest(request.request.get, '/api/projects/1/profiles')
    endpointAuthorizationTest(request.request.post, '/api/projects/1/profiles/1')

    endpointAuthorizationTest(request.request.get, '/api/profileprojects')

    endpointAuthorizationTest(request.request.get, '/api/profileprojects/1')
    endpointAuthorizationTest(request.request.put, '/api/profileprojects/1')
    endpointAuthorizationTest(request.request.delete, '/api/profileprojects/1')
  })
})
