const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

factory.define('user')
  .attr('username', () => { return faker.internet.userName() })
  .attr('admin', () => { return faker.random.boolean() })
  .attr('active', () => { return faker.random.boolean() })
  .attr('password', () => { return faker.internet.password(24) })
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

module.exports = {
  up: (queryInterface, Sequelize) => {
    let users = []
    for (let i = 0; i < 50; i++) {
      let user = factory.build('user')
      users.push(user)
    }
    return queryInterface.bulkInsert('Users', users)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users')
  }
}
