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
  profile => profileEndpoint + profile.id + '/projects/'
const profileProjectEndpoint = '/api/profileprojects/'
const createProject = generatePost(request, projectEndpoint)
const createUser = generatePost(request, '/api/users/')
const createProfile = generatePost(request, '/api/profiles')
const createProfileProject =
  (project, profile, attrs) => generatePost(request, profileEndpointFor(project) + profile.id)(attrs)
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

  db.profile1Project = await createProfileProject(db.project1, db.user1Profile, {
    profileId: db.user1Profile.id,
    projectId: db.project1.id,
    title: 'Työn johtaja',
    startDate: new Date('2017-01-01').toISOString(),
    endDate: new Date('2018-12-31').toISOString(),
    workPercentage: 30
  })

  db.profile2Project1 = await createProfileProject(db.project1, db.user2Profile, {
    profileId: db.user2Profile.id,
    projectId: db.project1.id,
    title: 'Kiillottaja',
    startDate: new Date('2017-01-02').toISOString(),
    endDate: new Date('2018-12-31').toISOString(),
    workPercentage: 80
  })

  db.profile2Project2 = await createProfileProject(db.project2, db.user2Profile, {
    profileId: db.user2Profile.id,
    projectId: db.project2.id,
    title: 'Taikaviitta',
    startDate: new Date('1970-01-01').toISOString(),
    endDate: null,
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

describe('Creating, updating and deleting projects', async () => {

  it('Should persist project and return the created project', async () => {
    let id

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

    id = created.body.id

    const fetched = await request
      .get(projectEndpoint + id)
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body).toMatchObject(created.body)

    const updatedProject = {
      name: 'updated',
      description: 'still testing',
      code: 10003,
      startDate: new Date('2000-01-01').toISOString(),
      endDate: new Date('2020-01-01').toISOString()
    }

    const updated = await request
      .put(projectEndpoint + id)
      .send(updatedProject)
      .expect(200)
    expect(updated.body).toMatchObject(updatedProject)

    const fetchedAgain = await request
      .get(projectEndpoint + id)
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetchedAgain.body).toMatchObject(updatedProject)

    const remove = await request
      .delete(projectEndpoint + id)
      .expect('Content-Type', "text/html; charset=utf-8")
      .expect(200)
    expect(remove.text).toEqual('Project with id: ' + id + ' was removed successfully.')

    const shouldNotExist = await request
      .get(projectEndpoint + id)
      .expect(404)
  })
})

describe('Fetching project\'s profiles', () => {
  console.log('Results are profileProject objects')

  it('Should return profiles in project', async () => {
    const projectsProfiles = await request
      .get(profileEndpointFor(db.project1))
      .expect('Content-Type', /json/)
      .expect(200)

    expect(projectsProfiles.body).toEqual(
      expect.arrayContaining([db.profile1Project, db.profile2Project1]))
  })
})

describe('Fetching profile\'s projects', () => {
  console.log('Results are profileProject objects')

  it('Should return profile\'s projects', async () => {
    const fetched = await request
      .get(projectEndpointFor(db.user2Profile))
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body).toEqual(expect.arrayContaining([db.profile2Project1, db.profile2Project2]))
  })
})

describe('Fetching profileProjects', () => {
  it('Should return all profileProjects', async () => {
    const all = await request
      .get(profileProjectEndpoint)
      .expect(200)
    expect(all.body).toEqual(expect.arrayContaining([db.profile1Project, db.profile2Project1, db.profile2Project2]))
  })

  it('Should return profileProject by id', async () => {
    const result = await request
      .get(profileProjectEndpoint + db.profile1Project.id)
      .expect(200)
    expect(result.body).toMatchObject(db.profile1Project)
  })

  it('Should return 404 if profileProject with given id does not exist', async () =>{
    const notFound = await request
      .get(profileProjectEndpoint + 1234)
      .expect(404)
  })
})

describe('Creating, updating and deleting profileProjects', async () => {
  // TODO: Do this test!

  it('Should test creating updating and deleting', async () => {
    let id

    const created = {
      startDate: new Date('2017-12-12').toISOString(),
      title: 'sidekick',
      workPercentage: 20
    }

    const create = await request
      .post(profileEndpointFor(db.project2) + db.user1Profile.id)
      .send(created)
      .expect(201)
    expect(create.body).toMatchObject(created)

    id = create.body.id

    const fetch = await request
      .get(profileProjectEndpoint + create.body.id)
      .expect(200)
    expect(fetch.body).toMatchObject(create.body)

    const all = await request
      .get(profileProjectEndpoint)
      .expect(200)
    expect(all.body).toEqual(
      expect.arrayContaining([db.profile1Project, db.profile2Project1, db.profile2Project2, create.body]))

    const foundByProject = await request
      .get(profileEndpointFor(db.project2))
      .expect(200)
    expect(foundByProject.body).toEqual(
      expect.arrayContaining([db.profile2Project2, create.body]))

    const foundByProfile = await request
      .get(projectEndpointFor(db.user1Profile))
      .expect(200)
    expect(foundByProfile.body).toEqual(
      expect.arrayContaining([db.profile1Project, create.body]))

    const updated = {
      startDate: new Date('2017-12-12').toISOString(),
      title: 'updated value',
      workPercentage: 25
    }

    const update = await request
      .put(profileProjectEndpoint + id)
      .send(updated)
      .expect(200)
    expect(update.body).toMatchObject(updated)

    const fetchedAgain = await request
      .get(profileProjectEndpoint + id)
      .expect(200)
    expect(fetchedAgain.body).toMatchObject(update.body)

    const removed = await request
      .delete(profileProjectEndpoint + id)
      .expect(200)
    expect(removed.text).toBe("Projects profile with id: " + id + ", was removed successfully")

    const shouldNotExist = await request
      .get(profileProjectEndpoint + id)
      .expect(404)
  })
})

describe('Testing data validations', () => {
  let project = {}

  beforeEach(() => {
    project = {
      name: 'Test',
      description: 'Testing testing',
      code: 10005,
      startDate: new Date('2010-10-10').toISOString(),
      endDate: new Date('2012-12-12').toISOString()
    }
  })

  it('Should return 400 if name is empty or null', async () => {
    project.name = ''
    const empty = await request
      .post(projectEndpoint)
      .send(project)
    expect(empty.status).toBe(400)
    expect(empty.body.error.details[0]).toBe('Name can not be empty!')

    delete project.name

    const nameNull = await request
      .post(projectEndpoint)
      .send(project)
    expect(nameNull.status).toBe(400)
    expect(nameNull.body.error.details[0]).toBe('Project.name cannot be null')
  })

  it('Should return 400 if name is not unique', async () => {
    project.name = 'Taikaviittailu'
    const notUnique = await request
      .post(projectEndpoint)
      .send(project)
    expect(notUnique.status).toBe(400)
    expect(notUnique.body.error.details[0]).toBe('name must be unique')
  })

  it('Should return 400 if code is negative or null', async() => {
    project.code = -1
    const negative = await request
      .post(projectEndpoint)
      .send(project)
    expect(negative.status).toBe(400)
    expect(negative.body.error.details[0]).toBe('Code can not be negative!')

    delete project.code
    const codeNull = await request
      .post(projectEndpoint)
      .send(project)
    expect(codeNull.status).toBe(400)
    expect(codeNull.body.error.details[0]).toBe('Project.code cannot be null')
  })

  it('Should return 400 if code is not unique', async() => {
    project.code = 10001
    const notUnique = await request
      .post(projectEndpoint)
      .send(project)
    expect(notUnique.status).toBe(400)
    expect(notUnique.body.error.details[0]).toBe('code must be unique')
  })

  it('Should return 400 if startDate is null', async() => {
    delete project.startDate
    const startDateNull = await request
      .post(projectEndpoint)
      .send(project)
    expect(startDateNull.status).toBe(400)
    expect(startDateNull.body.error.details[0]).toBe('Project.startDate cannot be null')
  })

  it('Should accept endDate to be null', async() => {
    delete project.endDate
    const endDateNull = await request
      .post(projectEndpoint)
      .send(project)
    expect(endDateNull.status).toBe(201)
  })

  it('Should return 400 if startDate is after endDate', async() => {
    project.endDate = new Date('2008-08-08').toISOString()
    const endBeforeStart = await request
      .post(projectEndpoint)
      .send(project)
    expect(endBeforeStart.status).toBe(400)
    expect(endBeforeStart.body.error.details[0]).toBe('Start date must be before end date!')
  })

})

describe('Testing profileProjects data validations', () =>{
  var pp

  beforeEach(() => {
    pp = {
      profileId: db.user1Profile.id,
      projectId: db.project2.id,
      title: 'sidekick',
      startDate: new Date('2010-10-10').toISOString(),
      endDate: new Date('2020-12-12').toISOString(),
      workPercentage: 50
    }
  })

  it('Should return 400 if startDate is null', async () => {
    delete pp.startDate
    const startDateNull = await request
      .post(profileEndpointFor(db.project2) + db.user1Profile.id)
      .send(pp)
    expect(startDateNull.status).toBe(400)
    expect(startDateNull.body.error.details[0]).toBe('ProfileProject.startDate cannot be null')
  })

  it('Should return 400 if workPercentage is null, less than 0 or over 100', async () => {
    pp.workPercentage = -1

    const negative = await request
      .post(profileEndpointFor(db.project2) + db.user1Profile.id)
      .send(pp)
    expect(negative.status).toBe(400)
    expect(negative.body.error.details[0]).toBe('Work percentage must be between 0 and 100!')

    pp.workPercentage = 101
    const tooBig = await request
      .post(profileEndpointFor(db.project2) + db.user1Profile.id)
      .send(pp)
    expect(tooBig.status).toBe(400)
    expect(tooBig.body.error.details[0]).toBe('Work percentage must be between 0 and 100!')

    delete pp.workPercentage
    const missing = await request
      .post(profileEndpointFor(db.project2) + db.user1Profile.id)
      .send(pp)
    expect(missing.status).toBe(400)
    expect(missing.body.error.details[0]).toBe('ProfileProject.workPercentage cannot be null')
  })

  it('Should return 400 if endDate is before startDate', async () => {
    pp.endDate = new Date('2008-08-08').toISOString()
    const endBeforeStart = await request
      .post(profileEndpointFor(db.project2) + db.user1Profile.id)
      .send(pp)
    expect(endBeforeStart.status).toBe(400)
    expect(endBeforeStart.body.error.details[0]).toBe('Start date must be before end date!')
  })

  it('Should return 400 if triplet of profileId, projectId and startDate is not unique', async () => {
    pp.startDate = db.profile1Project.startDate

    const notUnique = await request
      .post(profileEndpointFor(db.project1) + db.user1Profile.id)
      .send(pp)
    expect(notUnique.status).toBe(400)
    expect(notUnique.body.error.details[0]).toBe('profileId must be unique')
    expect(notUnique.body.error.details[1]).toBe('projectId must be unique')
    expect(notUnique.body.error.details[2]).toBe('startDate must be unique')
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
