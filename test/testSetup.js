require('babel-register')
require('babel-polyfill')

const { migrationsUmzug } = require('./utils')

module.exports = function () {
  return migrationsUmzug.up()
}
