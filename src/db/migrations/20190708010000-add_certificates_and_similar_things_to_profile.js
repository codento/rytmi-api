'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('profile', 'certificatesAndOthers', {
      type: Sequelize.JSONB
    })
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('profile', 'certificatesAndOthers')
  }
}
