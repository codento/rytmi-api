const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

factory.define('user')
  .attr('googleId', () => { return faker.random.number({min: 1000000000, max: 9999999999}) })
  .attr('firstName', () => { return faker.name.firstName() })
  .attr('lastName', () => { return faker.name.lastName() })
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())
  .attr('active', () => { return faker.random.boolean() })
  .attr('admin', () => { return faker.random.boolean() })

module.exports = {
  up: (queryInterface, Sequelize) => {
    try {
      let users = []
      for (let i = 0; i < 50; i++) {
        let user = factory.build('user')
        users.push(user)
      }
      return queryInterface.bulkInsert('user', users)
    } catch (e) {}
  },

  down: (queryInterface, Sequelize) => {
    try {
      return queryInterface.bulkDelete('user')
    } catch (e) {}
  }
}
