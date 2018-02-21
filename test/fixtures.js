import fs from 'fs'
import path from 'path'
import models from '../db/models'

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
    birthday: new Date().toISOString(),
    email: 'batman@example.com',
    phone: '555-BATMAN',
    title: 'Hero',
    description: 'Lorem',
    links: ['http://example.com'],
    photoPath: 'http://example.com/batman.png',
    active: true
  },
  user2Profile: {
    lastName: 'Man',
    firstName: 'Robin',
    birthday: new Date().toISOString(),
    email: 'robin@example.com',
    phone: '555-ROBIN',
    title: 'Sidekick',
    description: 'Lorem',
    links: ['http://example.com'],
    photoPath: 'http://example.com/robin.png',
    active: false
  },
  user3Profile: {
    lastName: 'Freeze',
    firstName: 'Mr',
    birthday: new Date().toISOString(),
    email: 'mrfreeze@example.com',
    phone: '555-MRFREEZE',
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
  await runMigrations(requireModules('../db/migrations'))
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

function requireModules (relativePath) {
  let fullPath = path.join(__dirname, relativePath)
  return fs.readdirSync(fullPath)
    .filter(file => (file.indexOf('.') !== 0) && (file.slice(-3) === '.js'))
    .map(file => require(path.join(fullPath, file)))
}

function runMigrations (modules) {
  return modules.reduce((chain, migration) => {
    return chain.then(() => {
      return migration.up(sequelize.queryInterface, sequelize.Sequelize)
    })
  }, Promise.resolve())
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
