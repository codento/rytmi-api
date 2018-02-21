import fixtures from '../fixtures'
const app = require('../../api/app')
const request = require('supertest')(app)
const db = fixtures.db
const byId = (a, b) => a.id - b.id

beforeEach(done => fixtures.init(done))
afterEach(done => fixtures.drop(done))
afterAll(done => fixtures.close(done))

describe('Fetching profiles', () => {
  it('should return active profiles', async () => {
    const active = await request
      .get('/api/profiles')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(active.body).toMatchObject([db.user1Profile])
  })

  it('should return all profiles', async () => {
    const all = await request
      .get('/api/profiles/all')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(all.body.sort(byId))
      .toMatchObject([
        db.user1Profile,
        db.user2Profile
      ].sort(byId))
  })

  it('should fetch profile by id', async () => {
    const fetched = await request
      .get('/api/profiles/' + db.user1Profile.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body).toMatchObject(db.user1Profile)
  })
})

describe('Creating and updating profiles', () => {
  it('should persist profile and return the created profile', async () => {
    const created = await request
      .post('/api/profiles')
      .send(db.user3Profile)
      .expect(201)
    expect(created.body).toMatchObject(db.user3Profile)

    const fetched = await request
      .get('/api/profiles/' + created.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body).toMatchObject(created.body)
  })

  it('should update profile and return the updated profile', async () => {
    const profile = {
      userId: db.user2.id,
      lastName: 'Name',
      firstName: 'Updated',
      email: 'updated@example.com',
      active: false
    }

    const updated = await request
      .put('/api/profiles/' + db.user2Profile.id)
      .send(profile)
      .expect(200)
    expect(updated.body).toMatchObject(profile)

    const fetched = await request
      .get('/api/profiles/' + db.user2Profile.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body).toMatchObject(profile)
  })

  it('should ignore passed id attribute', async () => {
    const profile = {
      id: 999999999,
      userId: db.user3.id,
      lastName: 'Freeze',
      firstName: 'Mr',
      email: 'mrfreeze@example.com',
      active: false
    }

    const created = await request
      .post('/api/profiles')
      .send(profile)
      .expect(201)
    expect(created.body.id).not.toBe(profile.id)

    const fetched = await request
      .get('/api/profiles/' + created.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body.id).not.toBe(profile.id)

    const updated = await request
      .put('/api/profiles/' + created.body.id)
      .send(profile)
      .expect(200)
    expect(updated.body.id).not.toBe(profile.id)

    const fetchedAgain = await request
      .get('/api/profiles/' + created.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetchedAgain.body.id).not.toBe(profile.id)
  })
})

describe('Fetching profileSkills', () => {
  it('should return profileSkills for the user', async () => {
    const profileSkills = await request
      .get('/api/profiles/' + db.user1Profile.id + '/skills')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(profileSkills.body.sort(byId))
      .toMatchObject([
        db.user1ProfileSkill1,
        db.user1ProfileSkill2
      ].sort(byId))
  })

  it('should return profileSkill by id', async () => {
    const profileSkill = await request
      .get('/api/profiles/' + db.user1Profile.id + '/skills/' + db.user1ProfileSkill1.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(profileSkill.body).toMatchObject(db.user1ProfileSkill1)
  })

  it('should return 404 for invalid profileskill', () => {
    return request
      .get('/api/profiles/' + db.user1Profile.id + '/skills/1000')
      .expect(404)
  })
  it('should return 404 if requesting other users profileskill', () => {
    return request
      .get('/api/profiles/' + db.user2Profile.id + '/skills/' + db.user1ProfileSkill1.id)
      .expect(404)
  })
})

describe('Creating, updating and deleting profileSkills', () => {
  it('should persist profileSkill and return the created profileSkill', async () => {
    const profileSkill = {
      skillId: 3,
      profileId: db.user1Profile.id,
      knows: 0,
      wantsTo: 5,
      visibleInCV: true,
      description: 'blah'
    }

    const created = await request
      .post('/api/profiles/' + db.user1Profile.id + '/skills/')
      .send(profileSkill)
      .expect(201)
    expect(created.body).toMatchObject(profileSkill)

    const fetched = await request
      .get('/api/profiles/' + db.user1Profile.id + '/skills/' + created.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body).toMatchObject(created.body)
  })

  it('should update profileSkill and return the updated profileSkill', async () => {
    const profileSkill = {
      skillId: 3,
      profileId: db.user1Profile.id,
      knows: 3,
      wantsTo: 3,
      visibleInCV: true,
      description: 'blah'
    }

    const updated = await request
      .put('/api/profiles/' + db.user1Profile.id + '/skills/' + db.user1ProfileSkill1.id)
      .send(profileSkill)
      .expect(200)
    expect(updated.body).toMatchObject(profileSkill)

    const fetched = await request
      .get('/api/profiles/' + db.user1Profile.id + '/skills/' + updated.body.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(fetched.body).toMatchObject(updated.body)
  })

  it('should delete profileSkill', async () => {
    await request
      .delete('/api/profiles/' + db.user1Profile.id + '/skills/' + db.user1ProfileSkill1.id)
      .expect(204)

    return request
      .get('/api/profiles/' + db.user1Profile.id + '/skills/' + db.user1ProfileSkill1.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
    // TODO: decide what 404 body should contain
    // expect(fetched.body).toBeNull()
  })
})

describe('Testing data validation', () => {
  it('should return 400 with invalid data', async () => {
    const profile = {
      lastName: 'LastName'
    }

    const created = await request
      .post('/api/profiles/')
      .send(profile)
    expect(created.status).toBe(400)
  })
})
