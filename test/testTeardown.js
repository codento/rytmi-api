require('babel-polyfill')
const { sequelize } = require('../src/db/models')

module.exports = async function () {
  return Promise.all([
    sequelize.queryInterface.dropAllTables(),
    sequelize.close()
  ])
}
