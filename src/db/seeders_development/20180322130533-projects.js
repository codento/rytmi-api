const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

factory.define('project')
  .attr('code')
  .attr('startDate', () => { return faker.date.past() })
  .attr('endDate', () => { return faker.date.future() })
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())
  .attr('isSecret', () => false)
  .attr('name')
  .attr('description')
  .attr('customerName')

module.exports = {
  up: (queryInterface, Sequelize) => {
    try {
      let projects = []
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
      for (var i = 0; i < 50; i++) {
        let name = faker.commerce.productName()
        let nameEndingNumber = faker.random.number({min: 0, max: nameEndingsFi.length - 1})
        let companyName = faker.company.companyName()
        let project = factory.build('project', {
          code: 5000 + i,
          name: JSON.stringify({
            fi: `${name} -${nameEndingsFi[nameEndingNumber]}`,
            en: `${name} -${nameEndingsEn[nameEndingNumber]}`
          }),
          description: JSON.stringify({
            fi: `(suomeksi) ${faker.lorem.sentences(1, 3)}`,
            en: `(in English) ${faker.lorem.sentences(1, 3)}`
          }),
          customerName: JSON.stringify({ fi: companyName, en: companyName }),
          isSecret: i < 2,
          isInternal: i > 2 && i < 8,
          isConfidential: i > 35
        })
        projects.push(project)
      }
      return queryInterface.bulkInsert('project', projects)
    } catch (e) {}
  },

  down: (queryInterface, Sequelize) => {
    try {
      return queryInterface.bulkDelete('project')
    } catch (e) {}
  }
}
