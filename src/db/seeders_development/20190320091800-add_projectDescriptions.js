const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

factory.define('projectDescription')
  .attr('projectId')
  .attr('name')
  .attr('description')
  .attr('language')
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

module.exports = {
  up: async (queryInterface) => {
    try {
      const projects = await queryInterface.sequelize.query('SELECT * FROM "project"', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
      let projectDescriptions = []
      const nameEndingsFi = [
        'projekti',
        'hanke',
        'konsultointi'
      ]
      const nameEndingsEn = [
        'project',
        'undertaking',
        'consulting'
      ]
      projects.forEach(project => {
        let name = faker.commerce.productName()
        let nameEndingNumber = faker.random.number({min: 0, max: nameEndingsFi.length - 1})
        projectDescriptions.push(factory.build('projectDescription', {
          projectId: project.id,
          name: `${name} -${nameEndingsFi[nameEndingNumber]}`,
          description: `(suomeksi) ${faker.lorem.sentences(1, 3)}`,
          language: 'fi'
        }))
        projectDescriptions.push(factory.build('projectDescription', {
          projectId: project.id,
          name: `${name} -${nameEndingsEn[nameEndingNumber]}`,
          description: `(in English) ${faker.lorem.sentences(1, 3)}`,
          language: 'en'
        }))
      })
      return queryInterface.bulkInsert('projectDescription', projectDescriptions)
    } catch (e) {}
  },

  down: (queryInterface) => {
    try {
      return queryInterface.bulkDelete('projectDescription')
    } catch (e) {}
  }
}
