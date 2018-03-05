require('babel-register')
require('babel-polyfill')
const { sequelize } = require('../src/db/models')

module.exports = function () {
  return Promise.all([
    sequelize.queryInterface.dropAllTables(),
    sequelize.close()
  ])
}
