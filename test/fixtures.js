import models from '../src/db/models'

const sequelize = models.sequelize
const db = {
  user1: {
    username: 'batman',
    password: 'trustNo1',
    active: true,
    admin: true
  },
  user2: {
    username: 'robin',
    password: 'trustNo1',
    active: false,
    admin: false
  },
  user3: {
    username: 'mrfreeze',
    password: 'ikuinenjää',
    active: false,
    admin: false
  },
  user1Profile: {
    lastName: 'Man',
    firstName: 'Bat',
    birthday: new Date('1970-01-01').toISOString(),
    email: 'batman@example.com',
    phone: '+358 40 41561',
    title: 'Hero',
    description: 'Lorem',
    links: ['http://example.com'],
    photoPath: 'http://example.com/batman.png',
    active: true
  },
  user2Profile: {
    lastName: 'Man',
    firstName: 'Robin',
    birthday: new Date('1970-01-01').toISOString(),
    email: 'robin@example.com',
    phone: '09 4561 4561',
    title: 'Sidekick',
    description: 'Lorem',
    links: ['http://example.com'],
    photoPath: 'http://example.com/robin.png',
    active: false
  },
  user3Profile: {
    lastName: 'Freeze',
    firstName: 'Mr',
    birthday: new Date('1970-01-01').toISOString(),
    email: 'mrfreeze@example.com',
    phone: '09 4616 1651 156',
    title: 'Bad guy',
    description: 'Lorem',
    links: ['http://example.com'],
    photoPath: 'http://example.com/mrfreeze.png',
    active: false
  },
  skill1: {
    name: 'COBOL',
    description: 'blah blah'
  },
  skill2: {
    name: 'PL/SQL',
    description: 'blah blah'
  },
  skill3: {
    name: 'VB.Net',
    description: 'blah blah'
  },
  user1ProfileSkill1: {
    skillId: 1,
    knows: 5,
    wantsTo: 1,
    visibleInCV: true,
    description: 'blah'
  },
  user1ProfileSkill2: {
    skillId: 2,
    knows: 3,
    wantsTo: 0,
    visibleInCV: true,
    description: 'blah'
  },
  user2ProfileSkill: {
    skillId: 1,
    knows: 0,
    wantsTo: 5,
    visibleInCV: true,
    description: 'blah'
  }
}

async function init (done) {
  await Promise.all([
    insertSkill(db.skill1),
    insertSkill(db.skill2),
    insertSkill(db.skill3)
  ])
  await Promise.all([
    insertUser(db.user1, db.user1Profile, [db.user1ProfileSkill1, db.user1ProfileSkill2]),
    insertUser(db.user2, db.user2Profile, [db.user2ProfileSkill]),
    models.User.build(db.user3).save().then(savedUser => {
      db.user3.id = savedUser.id
      db.user3Profile.userId = savedUser.id
    })
  ])
  done()
}

function insertSkill (skill) {
  return models.Skill.build(skill).save().then(savedSkill => {
    skill.id = savedSkill.id
  })
}

function insertUser (user, profile, profileSkills) {
  return models.User.build(user).save().then(savedUser => {
    user.id = savedUser.id
    profile.userId = savedUser.id
    return insertProfile(profile, profileSkills)
  })
}

function insertProfile (profile, profileSkills) {
  return models.Profile.build(profile).save().then(savedProfile => {
    profile.id = savedProfile.id
    return profileSkills.reduce((chain, profileSkill) => {
      profileSkill.profileId = savedProfile.id
      return chain.then(() => models.ProfileSkill.build(profileSkill).save()
        .then(savedProfileSkill => {
          profileSkill.id = savedProfileSkill.id
        }))
    }, Promise.resolve())
  })
}

export default {
  db: db,
  init: (done) => init(done),
  drop: (done) => sequelize.queryInterface.dropAllTables().then(() => done()),
  close: (done) => sequelize.close().then(() => done())
}
