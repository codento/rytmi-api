const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

const skillNames = ['Vue.js', 'Node.js', 'JavaScript', 'Java', 'Python', 'React.js', 'PHP', 'Linux', 'Kubernetes', 'Docker']

factory.define('skill')
  .attr('name')
  .attr('description', () => { return faker.lorem.paragraph() })
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

module.exports = {
  up: (queryInterface, Sequelize) => {
    let skills = skillNames.map(name => factory.build('skill', {name}))
    return queryInterface.bulkInsert('Skills', skills)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Skills')
  }
}
