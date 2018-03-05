require('babel-polyfill')
const {sequelize} = require('../src/db/models')
const { init } = require('./fixtures')

module.exports = async function () {
  return Promise.all([
    sequelize.sync({force: true}),
    init()
  ])
}
