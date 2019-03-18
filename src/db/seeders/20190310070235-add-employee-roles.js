'use strict'
require('babel-register')
require('babel-polyfill')

const roles = [
  { title: 'software developer', createdAt: new Date(), updatedAt: new Date() },
  { title: 'agile coach', createdAt: new Date(), updatedAt: new Date() },
  { title: 'administrative', createdAt: new Date(), updatedAt: new Date() }
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      return queryInterface.bulkInsert('employeeRole', roles, { fields: 'title' })
    } catch (e) {}
  },

  down: async (queryInterface, Sequelize) => {
    try {
      return queryInterface.bulkDelete('employeeRole')
    } catch (e) {}
  }
}
