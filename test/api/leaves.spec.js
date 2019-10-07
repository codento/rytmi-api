import '@babel/polyfill'
import { endpointAuthorizationTest } from '../utils'
import app from '../../src/api/app'
import supertest from 'supertest'
import defaults from 'superagent-defaults'
import { user as userModel, leave as leaveModel } from '../../src/db/models'
import { leaves } from '../mockData/mockLeaves'
import { createUserToken, invalidToken } from './tokens'

const request = defaults(supertest(app))
const leaveEndpoint = '/api/leaves/'

describe('API Leaves endpoint', () => {
  let normalUser
  beforeAll(async () => {
    const users = await userModel.findAll()
    normalUser = users.filter((user) => user.admin === false).pop()
    request.set('Accept', 'application/json')
    const jwtToken = createUserToken({
      googleId: normalUser.googleId,
      userId: normalUser.id,
      admin: normalUser.admin,
      exp: Date.now() + 36000
    })
    request.set('Authorization', `Bearer ${jwtToken}`)
  })
  afterAll(async () => {
    await leaveModel.destroy({ where: { description: 'maternityleave' } })
    const leavesInDb = await leaveModel.findAll()
    expect(leavesInDb.length).toEqual(leaves.length)
  })
  describe('Fetching leaves', () => {
    it('should allow authorized user to fetch leaves', async () => {
      const expectedLeaves = leaves
      const response = await request.get(leaveEndpoint).expect(200)
      expect(response.body.length).toEqual(expectedLeaves.length)
      for (const item of expectedLeaves) {
        expect(response.body).toContainEqual(expect.objectContaining(item))
      }
    })

    it('should allow authorized user to fetch specific leave by id', async () => {
      const paid = await leaveModel.findOne({ where: { description: 'paid leave' } })
      const response = await request.get(leaveEndpoint + paid.id).expect(200)
      expect(response.body.id).toEqual(paid.id)
      expect(response.body.description).toEqual(paid.description)
    })

    it('should allow authorized user to edit existing leave', async () => {
      const leaveFromDb = await leaveModel.findOne({ where: { description: 'unpaid leave' } })
      const unpaid = leaveFromDb.get()
      unpaid.description = 'not paid leave'
      const response = await request.put(leaveEndpoint + unpaid.id).send(unpaid).expect(200)
      expect(response.body.description).toEqual(unpaid.description)
      unpaid.description = 'unpaid leave'
      await request.put(leaveEndpoint + unpaid.id).send(unpaid).expect(200)
    })
  })

  describe('deleting leaves', () => {
    it('should allow authorized user to delete existing leave', async () => {
      const leaveFromDb = await leaveModel.findOne({ where: { description: 'unpaid leave' } })
      const unpaid = leaveFromDb.get()
      await request.delete(leaveEndpoint + unpaid.id).expect(204)
      const response = await request.get(leaveEndpoint).expect(200)
      expect(response.body).not.toContainEqual(expect.objectContaining(unpaid))
      delete unpaid.id
      await request.post(leaveEndpoint).send(unpaid).expect(201)
    })
  })

  describe('adding leave', () => {
    it('adds a leave', async () => {
      const leave = {
        description: 'maternity leave'
      }
      const response = await request.post(leaveEndpoint).send(leave).expect(201)
      expect(response.body).toMatchObject(leave)
    })
  })

  describe('leave validations', () => {
    it('should not allow leave without description', async () => {
      const leave = {
      }
      const response = await request.post(leaveEndpoint).send(leave).expect(400)
      expect(response.body.error.details[0]).toEqual('leave.description cannot be null')
    })

    it('should not allow two leaves with same name', async () => {
      const originalLeave = await request.get(leaveEndpoint + '/' + 1)
      const leave = {
        description: originalLeave.body.description
      }
      delete leave.id
      const response = await request.post(leaveEndpoint).send(leave).expect(400)
      expect(response.body.error.details[0]).toEqual('description must be unique')
    })

    it('should return 404 if fetched id does not exist', async () => {
      await request.get(leaveEndpoint + '11111').expect(404)
    })
  })

  describe('Endpoint authorization', () => {
    request.set('Authorization', `Bearer ${invalidToken}`)
    endpointAuthorizationTest(request.request.get, '/api/leaves')
    endpointAuthorizationTest(request.request.post, '/api/leaves')
    endpointAuthorizationTest(request.request.get, '/api/leaves/1')
    endpointAuthorizationTest(request.request.put, '/api/leaves/1')
  })
})
