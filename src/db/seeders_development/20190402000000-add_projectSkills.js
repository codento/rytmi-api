const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

factory.define('projectSkill')
  .attr('projectId')
  .attr('skillId')
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

module.exports = {
  up: async (queryInterface) => {
    try {
      const projects = await queryInterface.sequelize.query('SELECT * FROM "project"', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
      const skills = await queryInterface.sequelize.query('SELECT * FROM "skill"', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
      let projectSkills = []
      projects.forEach(project => {
        for (let i = 0; i < faker.random.number({min: 1, max: 5}); i++) {
          let skillId = faker.random.arrayElement(skills).id
          if (projectSkills.filter(projectSkill => projectSkill.projectId === project.id && projectSkill.skillId === skillId).length === 0) {
            projectSkills.push(factory.build('projectSkill', {
              projectId: project.id,
              skillId: skillId
            }))
          }
        }
      })
      return queryInterface.bulkInsert('projectSkill', projectSkills)
    } catch (e) {}
  },

  down: (queryInterface) => {
    try {
      return queryInterface.bulkDelete('projectSkill')
    } catch (e) {}
  }
}
