'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('profile', 'otherInfo', {
      type: Sequelize.JSONB
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('profile', 'otherInfo')
  }
}
