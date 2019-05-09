const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

factory.define('employerDescription')
  .attr('employerId')
  .attr('title')
  .attr('description')
  .attr('language')
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

module.exports = {
  up: async (queryInterface) => {
    try {
      const employers = await queryInterface.sequelize.query('SELECT * FROM "employer"', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
      let employerDescriptions = []
      const titleOptionsFi = [
        'Juniori koodari',
        'Vastaava ohjelmoija',
        'Pääohjelmoija',
        'Puuhari',
        'Tiiminvetäjä'
      ]
      const titleOptionsEn = [
        'Junior coder',
        'Senior programmer',
        'Lead developer',
        'Doer',
        'Team leader'
      ]
      const descriptionOptionsFi = [
        `Fronttikoodailua käyttäen monia eri frameworkkejä:
- React
- Vue.js
- Angular`,
        `Fullstack tekemistä kiinnostavissa asiakashommissa:
- Pankkisovelluksia
- Paikkatietohommia
- Tietokoneiden korjaamista
- Kahvin juontia`,
        `Yleistä puuhailua jännissä tehtävissä`
      ]
      const descriptionOptionsEn = [
        `Frontend development using several frameworks:
- React
- Vue.js
- Angular`,
        `Fullstack development with interesting clients:
- Finances
- GIS
- Fixing computers
- Drinking coffee`,
        `Generic work in exciting environments`
      ]
      employers.forEach(employer => {
        let titleNumber = faker.random.number({min: 0, max: titleOptionsFi.length - 1})
        let descriptionNumber = faker.random.number({min: 0, max: descriptionOptionsFi.length - 1})
        employerDescriptions.push(factory.build('employerDescription', {
          employerId: employer.id,
          title: titleOptionsFi[titleNumber],
          description: descriptionOptionsFi[descriptionNumber],
          language: 'fi'
        }))
        employerDescriptions.push(factory.build('employerDescription', {
          employerId: employer.id,
          title: titleOptionsEn[titleNumber],
          description: descriptionOptionsEn[descriptionNumber],
          language: 'en'
        }))
      })
      return queryInterface.bulkInsert('employerDescription', employerDescriptions)
    } catch (e) {}
  },

  down: (queryInterface) => {
    try {
      return queryInterface.bulkDelete('employerDescription')
    } catch (e) {}
  }
}
