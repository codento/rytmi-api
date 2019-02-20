import supertest from 'supertest'
import defaults from 'superagent-defaults'
import { endpointAuthorizationTest } from '../utils'
import app from '../../src/api/app'
import { createUserToken, invalidToken, testAdminToken } from './tokens'

import {
  user as userModel,
  project as projectModel,
  profileProject as ppModel
} from '../../src/db/models'

const request = defaults(supertest(app))

const profileProjectEndpoint = '/api/profileprojects/'

describe('API profileprojects endpoint', () => {
  let normalUser, adminUser
  let firstProfileProject, secondProfileProject

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
    request.set('Authorization', `Bearer ${jwtToken}`)
    const [someProject, anotherProject] = await projectModel.findAll()
    firstProfileProject = {
      profileId: normalUser.id,
      projectId: someProject.id,
      workPercentage: 100,
      startDate: new Date('2019-10-01').toISOString(),
      endDate: new Date('2019-10-31').toISOString()
    }
    secondProfileProject = {
      profileId: adminUser.id,
      projectId: anotherProject.id,
      workPercentage: 100,
      startDate: new Date('2019-11-03').toISOString(),
      endDate: new Date('2019-11-30').toISOString()
    }
    await ppModel.bulkCreate([firstProfileProject, secondProfileProject])
  })
  afterAll(async () => {
    await ppModel.destroy({ where: {}, truncate: false })
  })

  describe('Fetching profile projects', () => {
    it('should allow authorized user to fetch all profile projects', async () => {
      const expectedProfileProjects = [firstProfileProject, secondProfileProject]
      const response = await request.get(profileProjectEndpoint).expect(200)
      expect(response.body.length).toBe(expectedProfileProjects.length)
    })

    it('should allow authorized user to fetch specific profile project', async () => {
      const expectedProfileProject = firstProfileProject
      const insertedProfileProject = await ppModel.findOne({
        where: { profileId: normalUser.id, projectId: firstProfileProject.projectId }
      })
      const response = await request.get(profileProjectEndpoint + insertedProfileProject.id).expect(200)
      expect(response.body).toMatchObject(expectedProfileProject)
    })

    it('should return 404 for non-existent profile project', async () => {
      await request.get(profileProjectEndpoint + '1203013').expect(404)
    })
  })

  describe('Updating profile projects', () => {
    it('should allow authorized user to update their own profile projects', async () => {
      const expectedProfileProject = Object.assign({}, firstProfileProject)
      const insertedProfileProject = await ppModel.findOne({
        where: { profileId: normalUser.id, projectId: firstProfileProject.projectId }
      })
      expectedProfileProject.workPercentage = 80
      const response = await request.put(profileProjectEndpoint + insertedProfileProject.id)
        .send({ workPercentage: 80 }).expect(200)
      expect(response.body).toMatchObject(expectedProfileProject)
    })

    it('should not allow authorized user to edit other users profile projects', async () => {
      const expectedProfileProject = Object.assign({}, secondProfileProject)
      const insertedProfileProject = await ppModel.findOne({
        where: { profileId: adminUser.id, projectId: secondProfileProject.projectId }
      })
      expectedProfileProject.workPercentage = 80
      await request.put(profileProjectEndpoint + insertedProfileProject.id)
        .send({ workPercentage: 80 }).expect(403)
    })

    it('should allow admin to edit any project profile', async () => {
      // Set admin token
      request.set('Authorization', `Bearer ${testAdminToken}`)
      const expectedProfileProject = Object.assign({}, firstProfileProject)
      const insertedProfileProject = await ppModel.findOne({
        where: { profileId: normalUser.id, projectId: firstProfileProject.projectId }
      })
      expectedProfileProject.workPercentage = 70
      const response = await request.put(profileProjectEndpoint + insertedProfileProject.id)
        .send({ workPercentage: 70 }).expect(200)
      expect(response.body).toMatchObject(expectedProfileProject)
      // Set normal user token
      const jwtToken = createUserToken({
        googleId: normalUser.googleId,
        userId: normalUser.id,
        admin: normalUser.admin,
        exp: Date.now() + 3600
      })
      request.set('Authorization', `Bearer ${jwtToken}`)
    })
  })

  describe('Deleting profile projects', () => {
    it('should allow authorized user to delete their own profile project', async () => {
      const insertedProfileProject = await ppModel.findOne({
        where: { profileId: normalUser.id, projectId: firstProfileProject.projectId }
      })
      await request.delete(profileProjectEndpoint + insertedProfileProject.id)
        .expect(204)
      const shouldNotBeFound = await ppModel.findOne({
        where: { profileId: normalUser.id, projectId: firstProfileProject.projectId }
      })
      expect(shouldNotBeFound).toBe(null)
    })

    it('should not allow authorized user to delete other users profile project', async () => {
      const insertedProfileProject = await ppModel.findOne({
        where: { profileId: adminUser.id, projectId: secondProfileProject.projectId }
      })
      await request.delete(profileProjectEndpoint + insertedProfileProject.id)
        .expect(403)
    })

    it('should allow admin to delete any profile project', async () => {
      request.set('Authorization', `Bearer ${testAdminToken}`)
      const insertedProfileProject = await ppModel.create(firstProfileProject)
      await request.delete(profileProjectEndpoint + insertedProfileProject.id)
        .expect(204)
      const shouldNotBeFound = await ppModel.findOne({
        where: { profileId: normalUser.id, projectId: firstProfileProject.projectId }
      })
      expect(shouldNotBeFound).toBe(null)
    })
  })

  describe('Endpoint authorization', () => {
    request.set('Authorization', `Bearer ${invalidToken}`)
    endpointAuthorizationTest(request.request.get, '/api/profileprojects')
    endpointAuthorizationTest(request.request.get, '/api/profileprojects/1')
    endpointAuthorizationTest(request.request.put, '/api/profileprojects')
    endpointAuthorizationTest(request.request.put, '/api/profileprojects/1')
    endpointAuthorizationTest(request.request.delete, '/api/profileprojects')
    endpointAuthorizationTest(request.request.delete, '/api/profileprojects/1')
  })
})
