const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
const { Op } = require('sequelize')
faker.seed(1337)

factory.define('employer')
  .attr('name')
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

factory.define('profileEmployer')
  .attr('profileId')
  .attr('employerId')
  .attr('title')
  .attr('description')
  .attr('startDate')
  .attr('endDate')
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

module.exports = {
  up: async (queryInterface) => {
    try {
      let employers = []
      for (let i = 0; i < 25; i++) {
        employers.push(factory.build('employer', {
          name: faker.company.companyName()
        }))
      }
      await queryInterface.bulkInsert('employer', employers)

      const profilesFromDb = await queryInterface.sequelize.query('SELECT * FROM "profile"', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
      const employersFromDb = await queryInterface.sequelize.query('SELECT * FROM "employer"', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })

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
      let profileEmployers = []
      profilesFromDb.forEach((profile) => {
        let numberOfEmployers = faker.random.number(4)
        for (let employerIndex = 0; employerIndex < numberOfEmployers; employerIndex++) {
          let titleIndex = faker.random.number({ min: 0, max: titleOptionsFi.length - 1 })
          let descriptionIndex = faker.random.number({ min: 0, max: descriptionOptionsFi.length - 1 })
          profileEmployers.push(factory.build('profileEmployer', {
            profileId: profile.id,
            employerId: faker.random.arrayElement(employersFromDb).id,
            title: JSON.stringify({
              'fi': titleOptionsFi[titleIndex],
              'en': titleOptionsEn[titleIndex]
            }),
            description: JSON.stringify({
              'fi': descriptionOptionsFi[descriptionIndex],
              'en': descriptionOptionsEn[descriptionIndex]
            }),
            startDate: faker.date.past(1, `${2016 - employerIndex}-01-01`),
            endDate: faker.date.past(1, `${2018 - employerIndex}-01-01`)
          }))
        }
        let titleIndex = faker.random.number({ min: 0, max: titleOptionsFi.length - 1 })
        let descriptionIndex = faker.random.number({ min: 0, max: descriptionOptionsFi.length - 1 })
        profileEmployers.push(factory.build('profileEmployer', {
          profileId: profile.id,
          employerId: employersFromDb.find(employer => employer.name === 'Codento Oy').id,
          title: JSON.stringify({
            'fi': titleOptionsFi[titleIndex],
            'en': titleOptionsEn[titleIndex]
          }),
          description: JSON.stringify({
            'fi': descriptionOptionsFi[descriptionIndex],
            'en': descriptionOptionsEn[descriptionIndex]
          }),
          startDate: faker.date.past(1, '2019-04-30'),
          endDate: null
        }))
      })
      return queryInterface.bulkInsert('profileEmployer', profileEmployers)
    } catch (e) { }
  },

  down: async (queryInterface) => {
    try {
      await queryInterface.bulkDelete('profileEmployer')
      return queryInterface.bulkDelete('employer', { where: { name: { [Op.ne]: 'Codento Oy' } } })
    } catch (e) { }
  }
}
