const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

factory.define('profile')
  .attr('userId')
  .attr('lastName', () => { return faker.name.lastName() })
  .attr('firstName', () => { return faker.name.firstName() })
  .attr('email', () => { return faker.internet.email() })
  .attr('phone', () => { return faker.phone.phoneNumber() })
  .attr('birthday', () => { return faker.date.past(20, '1997-12-31') })
  .attr('title', () => { return faker.name.findName() })
  .attr('description', () => { return faker.lorem.paragraphs() })
  .attr('links')
  .attr('photoPath', () => { return faker.internet.avatar() })
  .attr('active', () => { return faker.random.boolean() })
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

module.exports = {
  up: (queryInterface, Sequelize) => {
    let profiles = []
    return queryInterface.sequelize.query('SELECT * FROM "Users"', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
      .then(users => {
        users.forEach(user => {
          let links = []
          let noOfLinks = faker.random.number(5)
          for (let j = 0; j < noOfLinks; j++) {
            links.push(faker.internet.url())
          }
          let profile = factory.build('profile', {
            userId: user.id,
            links: JSON.stringify(links)
          })
          profiles.push(profile)
        })
        return queryInterface.bulkInsert('Profiles', profiles)
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Profiles')
  }
}
