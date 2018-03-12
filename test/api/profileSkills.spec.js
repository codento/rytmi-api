import { generatePost } from '../utils'
import app from '../../src/api/app'
import supertest from 'supertest'

const request = supertest(app)
const profileSkillEndpoint = '/api/profileSkills/'
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
    name: 'ArnoldC',
    description: 'blah blah'
  })
  db.skill2 = await createSkill({
    name: 'Brainfuck',
    description: 'blah blah'
  })
  db.user1 = await createUser({
    googleId: '8732157813573548',
    firstName: 'tupu',
    lastName: 'ankka',
    active: true,
    admin: true
  })
  db.user2 = await createUser({
    googleId: '15648713281568',
    firstName: 'hupu',
    lastName: 'ankka',
    active: true,
    admin: true
  })
  db.user1Profile = await createProfile({
    userId: db.user1.id,
    lastName: 'Asdf',
    firstName: 'Mr',
    email: 'asdf@example.com',
    active: true
  })
  db.user2Profile = await createProfile({
    userId: db.user2.id,
    lastName: 'Man',
    firstName: 'Fdsa',
    email: 'fdsa@example.com',
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

describe('Fetching profileSkills', () => {
  it('should return all profileSkills', async () => {
    const all = await request
      .get(profileSkillEndpoint)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(all.body).toEqual(
      expect.arrayContaining([
        db.user1ProfileSkill1,
        db.user1ProfileSkill2,
        db.user2ProfileSkill
      ]))
  })

  it('should return profileSkill by id', async () => {
    const profileSkill = await request
      .get(profileSkillEndpoint + db.user1ProfileSkill1.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(profileSkill.body).toMatchObject(db.user1ProfileSkill1)
  })
})
