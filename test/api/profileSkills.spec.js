import fixtures from '../fixtures'
const app = require('../../src/api/app')
const request = require('supertest')(app)
const db = fixtures.db
const byId = (a, b) => a.id - b.id

beforeEach(done => fixtures.init(done))
afterEach(done => fixtures.drop(done))
afterAll(done => fixtures.close(done))

describe('Fetching profileSkills', () => {
  it('should return all profileSkills', async () => {
    const all = await request
      .get('/api/profileSkills')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(all.body.sort(byId))
      .toMatchObject([
        db.user1ProfileSkill1,
        db.user1ProfileSkill2,
        db.user2ProfileSkill
      ].sort(byId))
  })

  it('should return profileSkill by id', async () => {
    const profileSkill = await request
      .get('/api/profileSkills/' + db.user1ProfileSkill1.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(profileSkill.body).toMatchObject(db.user1ProfileSkill1)
  })
})
