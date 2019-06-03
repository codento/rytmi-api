'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'projectSkill',
      'deletedAt',
      {
        type: Sequelize.DATE,
        allowNull: true,
        validate: {
        }
      }
    )
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('projectSkill', 'deletedAt')
  }
}
