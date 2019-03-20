const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

factory.define('profileProjectDescription')
  .attr('profileId')
  .attr('projectId')
  .attr('title')
  .attr('description')
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
        let product1 = faker.commerce.product()
        let product2 = faker.commerce.product()
        let product3 = faker.commerce.product()
        profileProjectDescriptions.push(factory.build('profileProjectDescription', {
          profileId: profileProject.profileId,
          projectId: profileProject.projectId,
          title: faker.name.jobTitle(),
          description: `Softan kehittämistä työskennellen seuraavien tuotteiden parissa: ${product1}, ${product2} ja ${product3}`,
          language: 'fi'
        }))
        profileProjectDescriptions.push(factory.build('profileProjectDescription', {
          profileId: profileProject.profileId,
          projectId: profileProject.projectId,
          title: faker.name.jobTitle(),
          description: `Software development working with the following products: ${product1}, ${product2} ja ${product3}`,
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
