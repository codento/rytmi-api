require('babel-register')
require('babel-polyfill')
const { sequelize } = require('../src/db/models')
const fixtures = require('./fixtures')
const { runMigrations, requireModules } = require('./utils')

module.exports = function () {
  // return sequelize.sync({force: true})
  return runMigrations(requireModules('../src/db/migrations'))
    .then(() => {
      fixtures.init()
    })
}
