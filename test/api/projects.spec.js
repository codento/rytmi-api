import '@babel/polyfill'
import supertest from 'supertest'
import defaults from 'superagent-defaults'
import { endpointAuthorizationTest } from '../utils'
import app from '../../src/api/app'
import { createUserToken, invalidToken, testAdminToken } from './tokens'
import {
  user as userModel,
  project as projectModel,
  profileProject as profileProjectModel,
  employer as employerModel,
  profile as profileModel
} from '../../src/db/models'
import { projects } from '../mockData/mockProjects'

const request = defaults(supertest(app))
const projectEndpoint = '/api/projects/'
let employerCodento = {}

describe('API Projects endpoint', () => {
  let normalUser, normalUserProfileId, refactoringProjectId
  beforeAll(async () => {
    const users = await userModel.findAll()
    normalUser = users.filter((user) => user.admin === false).pop()
    normalUserProfileId = await profileModel.findOne({ where: {userId: normalUser.id} }).then(profile => {
      return profile.id
    })
    request.set('Accept', 'application/json')
    const jwtToken = createUserToken({
      googleId: normalUser.googleId,
      userId: normalUser.id,
      admin: normalUser.admin,
      exp: Date.now() + 36000
    })
    request.set('Authorization', `Bearer ${jwtToken}`)

    // const employers = await employerModel.findAll()
    const [employer] = await employerModel.findAll()
    employerCodento = employer.dataValues
  })
  afterAll(async () => {
    // profileProjects are created in 'Creating project profiles'
    const [reactProject, onGoingProject] = await projectModel.findAll()
    profileProjectModel.destroy({ where: {projectId: [reactProject.id, onGoingProject.id]} })
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
      // id generation is handled with autoincrement field => first item in mock data will be id=1
      reactProject.id = 1
      const expectedProject = await projectModel.findOne({ where: { id: reactProject.id } })
      const response = await request.get(projectEndpoint + expectedProject.id).expect(200)
      expect(response.body).toMatchObject(reactProject)
    })
  })
  describe('Creating projects', () => {
    it('should allow authorized user to create a project', async () => {
      const leanWorkshop = {
        code: 1010,
        startDate: new Date('2019-02-20').toISOString(),
        endDate: new Date('2019-02-21').toISOString(),
        description: { en: 'Lean workshop for customer', fi: 'Lean workshoppi asiakkaalle' },
        name: { en: 'Lean workshop', fi: 'Lean workshoppi' },
        customerName: { en: 'Best customer ever', fi: 'Ketterä asiakas' },
        isSecret: false,
        employerId: employerCodento.id,
        isInternal: false
      }
      const response = await request.post(projectEndpoint).send(leanWorkshop).expect(201)
      expect(response.body).toMatchObject(leanWorkshop)
      refactoringProjectId = response.body.id
    })

    it('should allow authorized user to create a project without end date', async () => {
      const refactoringCode = {
        code: 1050,
        startDate: new Date('2019-02-20').toISOString(),
        description: { en: 'This should be continuous', fi: 'Jatkuu ikuisesti' },
        name: { en: 'Refactoring old code', fi: 'Refaktorointi' },
        customerName: { en: null, fi: null },
        isSecret: false,
        employerId: employerCodento.id,
        isInternal: true
      }
      const response = await request.post(projectEndpoint).send(refactoringCode).expect(201)
      expect(response.body).toMatchObject(refactoringCode)
      refactoringProjectId = response.body.id
    })
  })

  describe('Deleting projects', () => {
    it('should allow authorized user to delete a project', async () => {
      await request.delete(projectEndpoint + refactoringProjectId).expect(204)
      const projects = await projectModel.findAll({ where: { id: refactoringProjectId } })
      expect(projects.length).toBe(0)
    })
  })

  describe('Updating projects', () => {
    it('should allow authorized user to edit project', async () => {
      const [reactProject] = projects
      const expectedProject = await projectModel.findOne({ where: { id: reactProject.id } })
      reactProject.name.en = 'Address app for lost'
      const response = await request.put(projectEndpoint + expectedProject.id).send(reactProject).expect(200)
      expect(response.body).toMatchObject(reactProject)
    })
  })

  describe('Project profiles', () => {
    let reactProjectId, onGoingProjectId
    let reactProjectProfile, onGoingProjectProfile

    beforeAll(async () => {
      // teared down in parent afterAll()
      const [reactProject, onGoingProject] = await projectModel.findAll()
      reactProjectId = reactProject.id
      onGoingProjectId = onGoingProject.id
      reactProjectProfile = {
        profileId: normalUserProfileId,
        projectId: reactProjectId,
        workPercentage: 100,
        role: { en: 'Something normal', fi: 'Normirooli' },
        startDate: new Date('2019-10-01').toISOString(),
        endDate: new Date('2019-10-31').toISOString()
      }
      onGoingProjectProfile = {
        profileId: normalUserProfileId,
        projectId: onGoingProjectId,
        workPercentage: 100,
        role: { en: 'Something normal', fi: 'Normirooli' },
        startDate: new Date('2019-11-03').toISOString(),
        endDate: new Date('2019-11-30').toISOString()
      }
    })

    describe('Creating project profiles', () => {
      it('should allow authorized user to add themself to a project', async () => {
        const response = await request.post(projectEndpoint + reactProjectId + '/profiles/' + normalUserProfileId)
          .send(reactProjectProfile).expect(201)
        expect(response.body).toMatchObject(reactProjectProfile)
      })

      it('should allow admin to add any user to a project', async () => {
        // Set admin token
        request.set('Authorization', `Bearer ${testAdminToken}`)
        const response = await request.post(projectEndpoint + onGoingProjectId + '/profiles/' + normalUserProfileId)
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
        startDate: new Date('2019-02-20').toISOString(),
        endDate: new Date('2019-02-21').toISOString(),
        description: { en: 'Lean workshop for customer' },
        name: { en: 'Lean workshop' },
        customerName: { en: 'Best customer ever' },
        isSecret: false
      }

      it('Should return 400 if name is empty or null', async () => {
        const noName = Object.assign({}, leanWorkshop)
        noName.name.en = null
        const response = await request.post(projectEndpoint).send(noName).expect(400)
        expect(response.body.error.details).not.toBe(null)
      })

      it('Should return 400 if code is not unique', async () => {
        const notUniqueCode = Object.assign({}, leanWorkshop)
        notUniqueCode.code = 1013
        const response = await request.post(projectEndpoint).send(notUniqueCode).expect(400)
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

      it('Should return 400 if name is not unique', async () => {
        const sameName = Object.assign({}, leanWorkshop)
        sameName.name.en = 'Some other workshop'
        const response = await request.post(projectEndpoint).send(sameName).expect(400)
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
