const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

const skillNames = [
  { fi: 'Vue.js', en: 'Vue.js' },
  { fi: 'Node.js', en: 'Node.js' },
  { fi: 'JavaScript', en: 'JavaScript' },
  { fi: 'Java', en: 'Java' },
  { fi: 'Python', en: 'Python' },
  { fi: 'React.js', en: 'React.js' },
  { fi: 'PHP', en: 'PHP' },
  { fi: 'Ketterät menetelmät', en: 'Agile methods' },
  { fi: 'Linux', en: 'Kubernetes' },
  { fi: 'Docker', en: 'Docker' }
]

factory.define('skill')
  .attr('name')
  .attr('description', () => { return JSON.stringify({ fi: '(suomeksi) ' + faker.lorem.paragraph(), en: faker.lorem.paragraph() }) })
  .attr('createdAt', () => { return faker.date.between('2016-01-01', '2016-12-31') })
  .attr('updatedAt', () => { return faker.date.between('2017-01-01', '2017-12-31') })

module.exports = {
  up: (queryInterface, Sequelize) => {
    try {
      let skills = skillNames.map(name => factory.build('skill', { name: JSON.stringify(name) }))
      return queryInterface.bulkInsert('skill', skills)
    } catch (e) {}
  },

  down: async (queryInterface, Sequelize) => {
    try {
      return queryInterface.bulkDelete('skill')
    } catch (e) {}
  }
}
