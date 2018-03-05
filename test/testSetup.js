require('babel-register')
require('babel-polyfill')
const {sequelize} = require('../src/db/models')
const fixtures = require('./fixtures')

module.exports = function () {
  console.log(fixtures)
  return Promise.all([
    sequelize.sync({force: true}),
    fixtures.init()
  ])
}
