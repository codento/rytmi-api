const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

factory.define('profile')
  .attr('userId')
  .attr('firstName')
  .attr('lastName')
  .attr('email', () => { return faker.internet.email() })
  .attr('phone', () => { return faker.phone.phoneNumber() })
  .attr('birthday', () => { return faker.date.past(20, '1997-12-31') })
  .attr('title', () => { return faker.name.jobTitle() })
  .attr('description', () => { return faker.lorem.paragraphs() })
  .attr('links')
  .attr('photoPath', () => { return faker.internet.avatar() })
  .attr('active', () => { return faker.random.boolean() })
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const profiles = []
      const userIds = await queryInterface.sequelize.query('SELECT * FROM public."user"', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
      userIds.forEach(user => {
        let links = []
        let noOfLinks = faker.random.number(5)
        for (let j = 0; j < noOfLinks; j++) {
          links.push(faker.internet.url())
        }
        let profile = factory.build('profile', {
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          links: JSON.stringify(links)
        })
        profiles.push(profile)
      })
      return queryInterface.bulkInsert('profile', profiles)
    } catch (e) {}
  },

  down: (queryInterface, Sequelize) => {
    try {
      return queryInterface.bulkDelete('profile')
    } catch (e) {}
  }
}
