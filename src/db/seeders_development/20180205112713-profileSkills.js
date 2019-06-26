require('@babel/register')
require('@babel/polyfill')

const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

factory.define('profileSkill')
  .attr('profileId')
  .attr('skillId')
  .attr('knows', () => { return faker.random.number(5) })
  .attr('wantsTo', () => { return faker.random.number(5) })
  .attr('description', () => { return faker.lorem.paragraphs() })
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const profileIds = await queryInterface.sequelize.query('SELECT "id" FROM "profile"', { type: Sequelize.QueryTypes.SELECT })
      const skillIds = await queryInterface.sequelize.query('SELECT "id" FROM "skill"', { type: Sequelize.QueryTypes.SELECT })
      const profileSkills = []
      profileIds.forEach(profile => {
        const randomSkills = []
        const noOfSkills = faker.random.number(5)
        while (randomSkills.length < noOfSkills) {
          let skill = skillIds[faker.random.number(skillIds.length - 1)]
          if (!(randomSkills.indexOf(skill) > -1)) {
            randomSkills.push(skill)
          }
        }
        randomSkills.forEach(skill => {
          profileSkills.push(factory.build('profileSkill', {
            profileId: profile.id,
            skillId: skill.id
          }))
        })
      })
      return queryInterface.bulkInsert('profileSkill', profileSkills)
    } catch (e) {}
  },

  down: (queryInterface, Sequelize) => {
    try {
      return queryInterface.bulkDelete('profileSkill')
    } catch (e) {}
  }
}
