require('@babel/register')
require('@babel/polyfill')
const { sequelize } = require('../src/db/models')

module.exports = function () {
  return sequelize.queryInterface.dropAllTables()
    .then(() => {
      sequelize.close()
    })
}
