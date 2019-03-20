const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

factory.define('profileCvDescription')
  .attr('profileId')
  .attr('description')
  .attr('language')
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

module.exports = {
  up: async (queryInterface) => {
    try {
      const profiles = await queryInterface.sequelize.query('SELECT * FROM "profile"', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
      let profileCvDescriptions = []
      profiles.forEach(profile => {
        if (faker.random.number(5) < 5) { // Not everyone has a cvDescription
          profileCvDescriptions.push(factory.build('profileCvDescription', {
            profileId: profile.id,
            description: `(suomeksi) ${faker.lorem.sentences(2, 4)}`,
            language: 'fi'
          }))
          profileCvDescriptions.push(factory.build('profileCvDescription', {
            profileId: profile.id,
            description: `(in English) ${faker.lorem.sentences(2, 4)}`,
            language: 'en'
          }))
        }
      })
      return queryInterface.bulkInsert('profileCvDescription', profileCvDescriptions)
    } catch (e) {}
  },

  down: (queryInterface) => {
    try {
      return queryInterface.bulkDelete('profileCvDescription')
    } catch (e) {}
  }
}
