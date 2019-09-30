const rosie = require('rosie')
const { addDays, differenceInDays } = require('date-fns')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

factory.define('leave')
  .attr('description')
  .attr('affectsUtilisation')
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

factory.define('absence')
  .attr('leaveId')
  .attr('profileId')
  .attr('startDate')
  .attr('endDate')
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

const descriptions = () => {
  return ['paid vacation', 'unpaid vacation', 'parental leave']
}

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async transaction => {
      const leaves = descriptions().map(description => {
        console.log(description)
        return factory.build('leave', {
          description: description,
          affectsUtilisation: faker.random.boolean()
        })
      })
      console.log(leaves)
      await queryInterface.bulkInsert('leave', leaves, { transaction })
      const insertedLeaves = await queryInterface.sequelize.query('SELECT * FROM "leave"', {
        type: queryInterface.sequelize.QueryTypes.SELECT,
        transaction
      })

      const profiles = await queryInterface.sequelize.query('SELECT * FROM "profile"', {
        type: queryInterface.sequelize.QueryTypes.SELECT,
        transaction
      })
      const absences = []
      profiles.forEach(profile => {
        let starterDays = 0
        for (let i = 0; i < faker.random.number(leaves.length - 1); i++) {
          const startDate = addDays(new Date(), faker.random.number({ min: starterDays + 1, max: 100 }))
          const endDate = addDays(startDate, faker.random.number(60))
          starterDays = differenceInDays(new Date(), endDate)
          absences.push(factory.build('absence', {
            leaveId: insertedLeaves[faker.random.number(leaves.length - 1)].id,
            profileId: profile.id,
            startDate: startDate,
            endDate: endDate
          }))
        }
      })
      console.log(absences)
      await queryInterface.bulkInsert('absence', absences, { transaction })
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.bulkDelete('leave', {}, { transaction })
      await queryInterface.bulkDelete('absence', {}, { transaction })
    })
  }
}
