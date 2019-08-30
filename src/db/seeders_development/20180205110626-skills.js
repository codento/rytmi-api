const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

const skillNames = ['Vue.js', 'Node.js', 'JavaScript', 'Java', 'Python', 'React.js', 'PHP', 'Linux', 'Kubernetes', 'Docker']

factory.define('skill')
  .attr('name')
  .attr('description', () => { return faker.lorem.paragraph() })
  .attr('createdAt', () => { return faker.date.between('2016-01-01', '2016-12-31') })
  .attr('updatedAt', () => { return faker.date.between('2017-01-01', '2017-12-31') })

module.exports = {
  up: (queryInterface, Sequelize) => {
    try {
      let skills = skillNames.map(name => factory.build('skill', {name}))
      return queryInterface.bulkInsert('skill', skills)
    } catch (e) {}
  },

  down: async (queryInterface, Sequelize) => {
    try {
      return queryInterface.bulkDelete('skill')
    } catch (e) {}
  }
}
