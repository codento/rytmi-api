const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

factory.define('project')
  .attr('name', () => { return faker.company.catchPhrase() })
  .attr('description', () => { return faker.lorem.paragraph() })
  .attr('code')
  .attr('startDate', () => { return faker.date.past() })
  .attr('endDate', () => { return faker.date.future() })
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

module.exports = {
  up: (queryInterface, Sequelize) => {
    let projects = []
    for (var i = 0; i < 50; i++) {
      let project = factory.build('project', {
        code: 5000 + i
      })
      projects.push(project)
    }
    return queryInterface.bulkInsert('Projects', projects)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Projects')
  }
};
