const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

factory.define('employer')
  .attr('profileId')
  .attr('name')
  .attr('startDate')
  .attr('endDate')
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

module.exports = {
  up: async (queryInterface) => {
    try {
      const profiles = await queryInterface.sequelize.query('SELECT * FROM "profile"', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
      let employers = []
      profiles.forEach(profile => {
        let numberOfEmployers = faker.random.number(4)
        for (let employerIndex = 0; employerIndex < numberOfEmployers; employerIndex++) {
          employers.push(factory.build('employer', {
            profileId: profile.id,
            name: faker.company.companyName(),
            startDate: new Date(2018 - employerIndex, faker.random.number(5), faker.random.number(28)),
            endDate: new Date(2018 - employerIndex, 6 + faker.random.number(6), faker.random.number(28))
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
