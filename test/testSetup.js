require('babel-register')
require('babel-polyfill')
const { runMigrations, requireModules } = require('./utils')

module.exports = function () {
  return runMigrations(requireModules('../src/db/migrations'))
}
