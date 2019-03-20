'use strict'
require('babel-register')
require('babel-polyfill')

const faker = require('faker')
faker.seed(1847)

const roles = [
  { title: 'software developer', createdAt: new Date(), updatedAt: new Date() },
  { title: 'agile coach', createdAt: new Date(), updatedAt: new Date() },
  { title: 'administrative', createdAt: new Date(), updatedAt: new Date() }
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkInsert('employeeRole', roles, { fields: 'title' })
      const profileIds = await queryInterface.sequelize.query('SELECT "id" FROM "profile"', { type: Sequelize.QueryTypes.SELECT })
      const savedRoles = await queryInterface.sequelize.query('SELECT "id" FROM "employeeRole"', { type: Sequelize.QueryTypes.SELECT })
      const rowUpdates = []
      profileIds.forEach(profile => {
        const role = faker.random.number({ min: savedRoles[0].id, max: savedRoles[savedRoles.length - 1].id })
        rowUpdates.push(queryInterface.sequelize.query(`UPDATE "profile" SET "employeeRoles" = ARRAY[${role}] WHERE "id" = ${profile.id}`))
      })
      await Promise.all(rowUpdates)
    } catch (e) {}
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.query(`UPDATE "profile" SET "employeeRoles" = NULL`)
      return queryInterface.bulkDelete('employeeRole')
    } catch (e) {}
  }
}
