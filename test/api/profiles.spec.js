import { generatePost } from '../utils'
import app from '../../src/api/app'
import supertest from 'supertest'

const request = supertest(app)
const profileEndpoint = '/api/profiles/'
const skillEndpointFor =
  profile => profileEndpoint + profile.id + '/skills/'
const createProfile = generatePost(request, profileEndpoint)
const createSkill = generatePost(request, '/api/skills/')
const createUser = generatePost(request, '/api/users/')
const createProfileSkill =
  (profile, attrs) => generatePost(request, skillEndpointFor(profile))(attrs)
const db = {}

beforeAll(async done => {
  db.skill1 = await createSkill({
    name: 'Symbian C++',
    description: 'blah blah'
  })
  db.skill2 = await createSkill({
    name: 'ABAP',
    description: 'blah blah'
  })
  db.user1 = await createUser({
    googleId: '489324891358',
    firstName: 'tupu',
    lastName: 'ankka',
    active: true,
    admin: true
  })
  db.user2 = await createUser({
    googleId: '478135781687',
    firstName: 'hupu',
    lastName: 'ankka',
    active: false,
    admin: false
  })
  db.user1Profile = await createProfile({
    userId: db.user1.id,
    lastName: 'ankka',
    firstName: 'tupu',
    birthday: new Date('1970-01-01').toISOString(),
    email: 'batman@example.com',
    phone: '+358 40 41561',
    title: 'Hero',
    description: 'Lorem',
    links: ['http://example.com'],
    photoPath: 'http://example.com/batman.png',
    active: true
  })
  db.user2Profile = await createProfile({
    userId: db.user2.id,
    lastName: 'ankka',
    firstName: 'hupu',
    birthday: new Date('1970-01-01').toISOString(),
    email: 'robin@example.com',
    phone: '09 4561 4561',
    title: 'Sidekick',
    description: 'Lorem',
    links: ['http://example.com'],
    photoPath: 'http://example.com/robin.png',
    active: false
  })
  db.user1ProfileSkill1 = await createProfileSkill(db.user1Profile, {
    profileId: db.user1Profile.id,
    skillId: db.skill1.id,
    knows: 5,
    wantsTo: 1,
    visibleInCV: true,
    description: 'blah'
  })
  db.user1ProfileSkill2 = await createProfileSkill(db.user1Profile, {
    profileId: db.user1Profile.id,
    skillId: db.skill2.id,
    knows: 3,
    wantsTo: 0,
    visibleInCV: true,
    description: 'blah'
  })
  db.user2ProfileSkill = await createProfileSkill(db.user2Profile, {
    profileId: db.user2Profile.id,
    skillId: db.skill1.id,
    knows: 0,
    wantsTo: 5,
    visibleInCV: true,
    description: 'blah'
  })
  done()
})

describe('Fetching profiles', () => {
  it('should return active profiles', async () => {
    const active = await request
      .get(profileEndpoint)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(active.body).toContainEqual(db.user1Profile)
    expect(active.body).not.toContainEqual(db.user2Profile)
  })

  it('should return all profiles', async () => {
    const all = await request
      .get(profileEndpoint + '/all')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(all.body).toEqual(
      expect.arrayContaining([db.user1Profile, db.user2Profile]))
  })

  it('should fetch profile by id', async () => {
    const fetched = await request
      .get(profileEndpoint + db.user1Profile.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body).toMatchObject(db.user1Profile)
  })
})

describe('Creating and updating profiles', () => {
  it('should persist/update profile and return the created/updated profile', async () => {
    const user = await createUser({
      googleId: '87637432435428',
      firstName: 'tupu',
      lastName: 'ankka',
      active: true,
      admin: true
    })

    const attrs = {
      userId: user.id,
      lastName: 'ankka',
      firstName: 'tupu',
      birthday: new Date('1970-01-01').toISOString(),
      email: 'mrfreeze@example.com',
      phone: '09 4616 1651 156',
      title: 'Bad guy',
      description: 'Lorem',
      links: ['http://example.com'],
      photoPath: 'http://example.com/mrfreeze.png',
      active: false
    }

    const created = await request
      .post(profileEndpoint)
      .send(attrs)
      .expect(201)
    expect(created.body).toMatchObject(attrs)

    const fetched = await request
      .get(profileEndpoint + created.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body).toMatchObject(created.body)

    const updatedAttrs = {
      userId: user.id,
      lastName: 'Name',
      firstName: 'Updated',
      email: 'updated@example.com',
      active: false
    }

    const updated = await request
      .put(profileEndpoint + created.body.id)
      .send(updatedAttrs)
      .expect(200)
    expect(updated.body).toMatchObject(updatedAttrs)

    const fetchedAgain = await request
      .get(profileEndpoint + created.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetchedAgain.body).toMatchObject(updatedAttrs)
  })

  it('should ignore passed id attribute', async () => {
    const user = await createUser({
      googleId: '18973217912375',
      firstName: 'Joker',
      lastName: 'Coolguy',
      active: true,
      admin: true
    })

    const attrs = {
      id: 999999999,
      userId: user.id,
      lastName: 'Joker',
      firstName: 'Mr',
      email: 'joker@example.com',
      active: false
    }

    const created = await request
      .post(profileEndpoint)
      .send(attrs)
      .expect(201)
    expect(created.body.id).not.toBe(attrs.id)

    const fetched = await request
      .get(profileEndpoint + created.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body.id).not.toBe(attrs.id)

    const updated = await request
      .put(profileEndpoint + created.body.id)
      .send(attrs)
      .expect(200)
    expect(updated.body.id).not.toBe(attrs.id)

    const fetchedAgain = await request
      .get(profileEndpoint + created.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetchedAgain.body.id).not.toBe(attrs.id)
  })

  it('should not allow two profiles with the same email', async () => {
    const user = await createUser({
      googleId: '984324891222327',
      firstName: 'tupu',
      lastName: 'ankka',
      active: true,
      admin: true
    })

    const profile = {
      userId: user.id,
      lastName: 'Scarecrow',
      firstName: 'Mr',
      email: db.user1Profile.email,
      active: false
    }

    const validationErrors = ['email must be unique']

    const failed = await request
      .post(profileEndpoint)
      .send(profile)
      .expect(400)
    expect(failed.body.error.details).toEqual(validationErrors)
  })
})

describe('Fetching profileSkills', () => {
  it('should return profileSkills for the user', async () => {
    const profileSkills = await request
      .get(skillEndpointFor(db.user1Profile))
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(profileSkills.body).toEqual(
      expect.arrayContaining([db.user1ProfileSkill1, db.user1ProfileSkill2]))
  })

  it('should return profileSkill by id', async () => {
    const profileSkill = await request
      .get(skillEndpointFor(db.user1Profile) + db.user1ProfileSkill1.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(profileSkill.body).toMatchObject(db.user1ProfileSkill1)
  })

  it('should return 404 for invalid profileskill', () => {
    return request
      .get(profileEndpoint + db.user1Profile.id + '/skills/1000')
      .expect(404)
  })
  it('should return 404 if requesting other users profileskill', () => {
    return request
      .get(profileEndpoint + db.user2Profile.id + '/skills/' + db.user1ProfileSkill1.id)
      .expect(404)
  })
})

describe('Creating, updating and deleting profileSkills', () => {
  it('should persist profileSkill and return the created profileSkill', async () => {
    const user = await createUser({
      googleId: '897321324798324',
      firstName: 'tupu',
      lastName: 'ankka',
      active: true,
      admin: true
    })

    const profile = await createProfile({
      userId: user.id,
      lastName: 'Pinquin',
      firstName: 'Mr',
      email: 'pinquin@example.com',
      active: true
    })

    const attrs = {
      skillId: db.skill1.id,
      profileId: profile.id,
      knows: 0,
      wantsTo: 5,
      visibleInCV: true,
      description: 'blah'
    }

    const created = await request
      .post(skillEndpointFor(profile))
      .send(attrs)
      .expect(201)
    expect(created.body).toMatchObject(attrs)

    const fetched = await request
      .get(skillEndpointFor(profile) + created.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body).toMatchObject(created.body)

    const updatedAttrs = {
      skillId: db.skill2.id,
      profileId: profile.id,
      knows: 3,
      wantsTo: 3,
      visibleInCV: true,
      description: 'blah'
    }

    const updated = await request
      .put(skillEndpointFor(profile) + created.body.id)
      .send(updatedAttrs)
      .expect(200)
    expect(updated.body).toMatchObject(updatedAttrs)

    const fetchedAgain = await request
      .get(skillEndpointFor(profile) + updated.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetchedAgain.body).toMatchObject(updated.body)
  })

  it('should ignore profileId in body', async () => {
    const user = await createUser({
      googleId: '35723871489',
      firstName: 'tupu',
      lastName: 'ankka',
      active: true,
      admin: true
    })

    const profile = await createProfile({
      userId: user.id,
      lastName: 'Riddler',
      firstName: 'Mr',
      email: 'riddler@example.com',
      active: true
    })

    const profileSkill = {
      skillId: db.skill1.id,
      profileId: db.user1Profile.id,
      knows: 0,
      wantsTo: 5,
      visibleInCV: true,
      description: 'blah'
    }

    const created = await request
      .post(profileEndpoint + profile.id + '/skills/')
      .send(profileSkill)
      .expect(201)
    expect(created.body.profileId).toEqual(profile.id)
  })

  it('should delete profileSkill', async () => {
    await request
      .delete(profileEndpoint + db.user1Profile.id + '/skills/' + db.user1ProfileSkill1.id)
      .expect(204)

    return request
      .get(profileEndpoint + db.user1Profile.id + '/skills/' + db.user1ProfileSkill1.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
    // TODO: decide what 404 body should contain
    // expect(fetched.body).toBeNull()
  })

  it('should not allow multiple profileskills with the same profile/skill-combination', async () => {
    const skill = await createSkill({
      name: 'Coldfusion',
      description: 'blah blah'
    })

    const profileSkill = {
      skillId: skill.id,
      profileId: db.user1Profile.id,
      knows: 3,
      wantsTo: 3,
      visibleInCV: true
    }

    // TODO: does not tell that the *combination* of these should be unique
    const validationErrors = ['profileId must be unique', 'skillId must be unique']

    await request
      .post(profileEndpoint + db.user1Profile.id + '/skills/')
      .send(profileSkill)
      .expect(201)

    const failed = await request
      .post(profileEndpoint + db.user1Profile.id + '/skills/')
      .send(profileSkill)
      .expect(400)
    expect(failed.body.error.details).toMatchObject(validationErrors)
  })
})

describe('Testing data validation', () => {
  it('should return 400 with invalid data', async () => {
    const profile = {
      lastName: 'LastName'
    }

    const created = await request
      .post(profileEndpoint)
      .send(profile)
    expect(created.status).toBe(400)
  })

  it('should include mandatory fields in profile validation errors', async () => {
    const validationErrors = [
      'Profile.lastName cannot be null',
      'Profile.firstName cannot be null',
      'Profile.email cannot be null',
      'Profile.active cannot be null'
    ]

    const created = await request
      .post(profileEndpoint)
      .send({})
    expect(created.status).toBe(400)
    expect(created.body.error.details).toMatchObject(validationErrors)
  })

  it('should include mandatory fields in profileskill validation errors', async () => {
    const validationErrors = [
      'ProfileSkill.skillId cannot be null',
      'ProfileSkill.knows cannot be null',
      'ProfileSkill.wantsTo cannot be null',
      'ProfileSkill.visibleInCV cannot be null'
    ]

    const created = await request
      .post(profileEndpoint + db.user1Profile.id + '/skills')
      .send({})
      .expect(400)
    expect(created.body.error.details).toMatchObject(validationErrors)
  })
})
