const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

factory.define('profileProjectDescription')
  .attr('profileProjectId')
  .attr('title')
  .attr('language')
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

module.exports = {
  up: async (queryInterface) => {
    try {
      const profileProjects = await queryInterface.sequelize.query('SELECT * FROM "profileProject"', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
      let profileProjectDescriptions = []
      profileProjects.forEach(profileProject => {
        profileProjectDescriptions.push(factory.build('profileProjectDescription', {
          profileProjectId: profileProject.id,
          title: faker.name.jobTitle(),
          language: 'fi'
        }))
        profileProjectDescriptions.push(factory.build('profileProjectDescription', {
          profileProjectId: profileProject.id,
          title: faker.name.jobTitle(),
          language: 'en'
        }))
      })
      return queryInterface.bulkInsert('profileProjectDescription', profileProjectDescriptions)
    } catch (e) {}
  },

  down: (queryInterface) => {
    try {
      return queryInterface.bulkDelete('profileProjectDescription')
    } catch (e) {}
  }
}
