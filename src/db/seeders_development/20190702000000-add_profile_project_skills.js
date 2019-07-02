const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

factory.define('profileProjectSkill')
  .attr('skillId')
  .attr('profileProjectId')
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

module.exports = {
  up: async (queryInterface) => {
    try {
      const skills = await queryInterface.sequelize.query('SELECT * FROM "skill"', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
      const profileProjects = await queryInterface.sequelize.query('SELECT * FROM "profileProject"', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })

      let profileProjectSkills = []
      profileProjects.forEach(profileProject => {
        let skillsAvailable = [...skills]
        for (let i = 0; i < faker.random.number(skills.length - 1); i++) {
          profileProjectSkills.push(factory.build('profileProjectSkill', {
            profileProjectId: profileProject.id,
            skillId: skillsAvailable.splice(faker.random.number(skillsAvailable.length) - 1, 1)[0].id
          }))
        }
      })

      return queryInterface.bulkInsert('profileProjectSkill', profileProjectSkills)
    } catch (e) { }
  },

  down: async (queryInterface) => {
    try {
      await queryInterface.bulkDelete('profileProjectSkill')
    } catch (e) { }
  }
}
