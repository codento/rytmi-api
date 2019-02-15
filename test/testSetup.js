require('babel-register')
require('babel-polyfill')

const { Op } = require('sequelize')
const { migrationsUmzug } = require('./utils')
const { user, profile, skill, skillCategory, skillGroup } = require('../src/db/models/')
const { users, profiles } = require('./mockData/mockUsers')
const { skills, skillCategories, skillGroups } = require('./mockData/mockSkills')
const tearDown = require('./testTeardown')

module.exports = async function () {
  await executeMigrations()
  return insertTestUsersWithProfiles()
}

const executeMigrations = () => migrationsUmzug.up()

const insertTestUsersWithProfiles = async () => {
  try {
    await user.bulkCreate(users)
    await profile.bulkCreate(profiles)
    await createSkills()
  } catch (error) {
    console.error(error)
    await tearDown()
    throw new Error('Test setup failed')
  }
}

const createSkills = async () => {
  await skillGroup.bulkCreate(skillGroups)
  const createdSkillGroup = await skillGroup.findAll({ where: { title: skillGroups[0].title } })
  const skillCategoriesToInsert = skillCategories.map(skillCategory => {
    skillCategory.skillGroupId = createdSkillGroup[0].id
    return skillCategory
  })
  const createdSkillCategories = await skillCategory.bulkCreate(skillCategoriesToInsert)
    .then(() => skillCategory.findAll({where: {title: {[Op.ne]: 'Uncategorized'}}}))
  const skillsToInsert = skills.map((skill, idx) => {
    skill.skillCategoryId = createdSkillCategories[idx].id
    return skill
  })
  await skill.bulkCreate(skillsToInsert)
}
