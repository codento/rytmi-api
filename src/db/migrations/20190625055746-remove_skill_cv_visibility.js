'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('profileSkill', 'visibleInCV')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('profileSkill', 'visibleInCV', {
      type: Sequelize.DataTypes.BOOLEAN
    })
  }
}
