const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

factory.define('employer')
  .attr('name')
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

module.exports = {
  up: async (queryInterface) => {
    try {
      const profiles = await queryInterface.sequelize.query('SELECT * FROM "profile"', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
      let employers = []
      profiles.forEach(() => {
        let numberOfEmployers = faker.random.number(4)
        for (let employerIndex = 0; employerIndex < numberOfEmployers; employerIndex++) {
          employers.push(factory.build('employer', {
            name: faker.company.companyName()
          }))
        }
      })
      return queryInterface.bulkInsert('employer', employers)
    } catch (e) {}
  },

  down: (queryInterface) => {
    try {
      return queryInterface.bulkDelete('employer')
    } catch (e) {}
  }
}
