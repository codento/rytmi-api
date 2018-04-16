import { generatePost, endpointAuthorizationTest } from '../utils'
import app from '../../src/api/app'
import supertest from 'supertest'
import defaults from 'superagent-defaults'
import { testUserToken, invalidToken } from './tokens'

const request = defaults(supertest(app))

const projectEndpoint = '/api/projects/'
const profileEndpoint = '/api/profiles/'
const profileEndpointFor =
  project => projectEndpoint + project.id + '/profiles/'
const projectEndpointFor =
  profile => profileEndpoint + profile.id + '/projects'
const createProject = generatePost(request, projectEndpoint)
const createUser = generatePost(request, '/api/users/')
const createProfile = generatePost(request, '/api/profiles')
const createProfileProject =
  (project, attrs) => generatePost(request, profileEndpointFor(project))(attrs)
const db = {}
// TODO: Remainig consts

beforeAll(async done => {
  request.set('Authorization', `Bearer ${testUserToken}`)
  request.set('Accept', 'application/json')

  db.user1 = await createUser({
    googleId: '9275974827395',
    firstName: 'roope',
    lastName: 'ankka',
    active: true,
    admin: true
  })

  db.user2 = await createUser({
    googleId: '828784923994',
    firstName: 'aku',
    lastName: 'ankka',
    active: true,
    admin: true
  })

  db.user1Profile = await createProfile({
    userId: db.user1.id,
    lastName: 'ankka',
    firstName: 'roope',
    birthday: new Date('1970-01-01').toISOString(),
    email: 'roope@example.com',
    phone: '+358 40 12345',
    title: 'Ensilantin omistaja',
    description: 'Lorem',
    links: ['http://example.com'],
    photoPath: 'http://example.com/scrooge.png',
    active: true
  })

  db.user2Profile = await createProfile({
    userId: db.user2.id,
    lastName: 'ankka',
    firstName: 'aku',
    birthday: new Date('1970-01-01').toISOString(),
    email: 'aku@example.com',
    phone: '+358 40 54321',
    title: 'Tunari',
    description: 'Lorem',
    links: ['http://example.com'],
    photoPath: 'http://example.com/donald.png',
    active: true
  })

  db.project1 = await createProject({
    name: 'Kolikoiden kiillottaminen',
    description: 'Lorem ipsum',
    code: 10001,
    startDate: new Date('2017-01-01').toISOString(),
    endDate: new Date('2018-12-31').toISOString()
  })

  db.project2 = await createProject({
    name: 'Taikaviittailu',
    description: 'superhessu on ikuinen kakkonen',
    code: 10002,
    startDate: new Date('1970-01-01').toISOString(),
    endDate: null
  })

  db.profile1Project = await createProfileProject(db.project1, {
    ProfileId: db.user1Profile.id,
    ProjectId: db.project1.id,
    title: 'Työn johtaja',
    startAt: new Date('2017-01-01').toISOString(),
    finishAt: new Date('2018-12-31').toISOString(),
    workPercentage: 30
  })

  db.profile2Project1 = await createProfileProject(db.project1, {
    ProfileId: db.user2Profile.id,
    ProjectId: db.project1.id,
    title: 'Kiillottaja',
    startAt: new Date('2017-01-02').toISOString(),
    finishAt: new Date('2018-12-31').toISOString(),
    workPercentage: 80
  })

  db.profile2Project2 = await createProfileProject(db.project2, {
    ProfileId: db.user2Profile.id,
    ProjectId: db.project2.id,
    title: 'Taikaviitta',
    startAt: new Date('1970-01-01').toISOString(),
    finishAt: null,
    workPercentage: 20
  })
  done()
})

describe('Fetching projects', () => {
  it('Should return all projects', async () => {
    const all = await request
      .get(projectEndpoint)
      .expect('Content-Type', /json/)
      .expect(200)
    expect(all.body).toEqual(
      expect.arrayContaining([db.project1, db.project2]))
  })

  it('should return project by id', async () => {
    const fetched = await request
      .get(projectEndpoint + db.project1.id)
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body).toMatchObject(db.project1)
  })

  it('Should return 404 if project doesn\'t exist', async () => {
    const shouldNotExist = await request
      .get(projectEndpoint + 100)
      .expect(404)
  })
})

describe('Creating, updating and deleting projects', () => {
  it('should persist/update/delete project and return the created/updated project or delete-message', async () => {
    const project = {
      name: 'newProject',
      description: 'testing testing',
      code: 10003,
      startDate: new Date('2000-01-01').toISOString(),
      endDate: new Date('2020-01-01').toISOString()
    }

    const created = await request
      .post(projectEndpoint)
      .send(project)
      .expect(201)
    expect(created.body).toMatchObject(project)

    const fetched = await request
      .get(projectEndpoint + created.body.id)
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body).toMatchObject(created.body)

    const updatedProject = {
      name: 'updated',
      description: 'still testing'
    }

    const updated = await request
      .put(projectEndpoint + created.body.id)
      .send(updatedProject)
      .expect(200)
    expect(updated.body).toMatchObject(updatedProject)

    const fetchedAgain = await request
      .get(projectEndpoint + created.body.id)
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetchedAgain.body).toMatchObject(updatedProject)

    const remove = await request
      .delete(projectEndpoint + updated.body.id)
      .expect('Content-Type', "text/html; charset=utf-8")
      .expect(200)
    expect(remove.text).toEqual('Project with id: ' + updated.body.id + ' was removed successfully.')

    const shouldNotExist = await request
      .get(projectEndpoint + updated.body.id)
      .expect(404)
  })
})

describe("Fetching project's profiles", () => {
  console.log('Results are profileProject objects')
  const test = {}

  beforeAll(() => {
    test.ProfileProject1 = Object.assign({}, db.profile1Project)
    test.ProfileProject2 = Object.assign({}, db.profile2Project1)
    delete test.ProfileProject1.id
    delete test.ProfileProject2.id
  })

  it('Should return profiles in project', async () => {
    const projectsProfiles = await request
      .get(profileEndpointFor(db.project1))
      .expect('Content-Type', /json/)
      .expect(200)

    expect(projectsProfiles.body).toEqual(
      expect.arrayContaining([test.ProfileProject1, test.ProfileProject2]))
  })

  it('Should return profileProject by id', async () => {
    const fetched = await request
      .get(profileEndpointFor(db.project1) + db.user1Profile.id)
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body).toMatchObject(test.ProfileProject1)
  })

  it('Should return 404 for invalid profileId', async () => {
    return request
      .get(profileEndpointFor(db.project1) + 1000)
      .expect(404)
  })

  it('Should return 404 if requesting with profiles id that\'s not in the project', async () => {
    return request
      .get(profileEndpointFor(db.project2) + db.user1Profile.id)
      .expect(404)
  })
})

describe('Fetching profile\'s projects', async () => {
  console.log('Results are profileProject objects')
  const test = {}

  beforeAll(() => {
    test.ProfileProject1 = Object.assign({}, db.profile2Project1)
    test.ProfileProject2 = Object.assign({}, db.profile2Project2)
    delete test.ProfileProject1.id
    delete test.ProfileProject2.id
  })

  it('Should return profile\'s projects', async () => {
    const fetched = await request
      .get(projectEndpointFor(db.user2Profile))
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body).toEqual(expect.arrayContaining([test.ProfileProject1, test.ProfileProject2]))
  })
})

describe('Creating, updating and deleting profileProjects', () => {
  it('Should create, update and delete profileProject successfully', async () => {
    const profile1Project2 = {
      ProfileId: db.user1Profile.id,
      ProjectId: db.project2.id,
      title: 'projektiin kuulumaton',
      startAt: new Date('2017-01-01').toISOString(),
      finishAt: new Date('2018-01-01').toISOString(),
      workPercentage: 50
    }

    // --- CREATE ---

    const created = await request
      .post(profileEndpointFor(db.project2))
      .send(profile1Project2)
      .expect(201)
    expect(created.body).toMatchObject(profile1Project2)

    const fetched = await request
      .get(profileEndpointFor(db.project2) + db.user1Profile.id)
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body).toMatchObject(profile1Project2)

    // --- UPDATE ---

    const update = {
      title: 'poistetaan pian',
      startAt: new Date('2017-06-31').toISOString(),
      workPercentage: 20
    }

    const result = {
      ProfileId: db.user1Profile.id,
      ProjectId: db.project2.id,
      title: 'poistetaan pian',
      startAt: new Date('2017-06-31').toISOString(),
      finishAt: new Date('2018-01-01').toISOString(),
      workPercentage: 20
    }

    const updated = await request
      .put(profileEndpointFor(db.project2) + db.user1Profile.id)
      .send(update)
      .expect(200)
    expect(updated.body).toMatchObject(result)

    const fetchedAgain = await request
      .get(profileEndpointFor(db.project2) + db.user1Profile.id)
      .expect('Content-Type', /json/)
      .expect(200)

    // NOTE: createdAt, updatedAt and Id need to be removed from the compared object

    delete fetchedAgain.body.createdAt
    delete fetchedAgain.body.updatedAt
    delete fetchedAgain.body.id

    expect(fetchedAgain.body).toMatchObject(result)

    // --- DELETE ---
    const profileProjectToPreserve = Object.assign({}, db.profile2Project2)
    delete profileProjectToPreserve.id

    const fetchAll = await request
      .get(profileEndpointFor(db.project2))
      .expect('Content-Type', /json/)
      .expect(200)

    delete fetchAll.body[1].createdAt
    delete fetchAll.body[1].updatedAt

    expect(fetchAll.body).toEqual(
      expect.arrayContaining([profileProjectToPreserve, result]))

    const removed = await request
      .delete(profileEndpointFor(db.project2) + result.ProfileId)
      .expect('Content-Type', "text/html; charset=utf-8")
      .expect(200)
    expect(removed.text).toEqual('Projects profile with id: ' + result.ProfileId + ', was removed successfully')

    const shouldNotExist = await request
      .get(profileEndpointFor(db.project2) + result.ProfileId)
      .expect(404)
  })
})

describe('Testing data validations', () => {
  const project = {}

  beforeEach(async done => {
    await (project = {
      name: 'Test',
      description: 'Testing testing',
      code: 10005,
      startDate: new Date('2010-10-10').toISOString(),
      endDate: new Date('2012-12-12').toISOString()
    })
    done()
  })

  it('Should return 400 if name is empty', async () => {
    const result = await request
      .post(projectEndpoint)
      .send(project)
    expect(result.status).toBe(400)
  })
})
