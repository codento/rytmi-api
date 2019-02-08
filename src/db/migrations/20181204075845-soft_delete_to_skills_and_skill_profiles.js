'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.addColumn(
      'Skills',
      'deletedAt',
      {
        type: Sequelize.DATE,
        allowNull: true,
        validate: {
        }
      }
    ),
    queryInterface.addColumn(
      'ProfileSkills',
      'deletedAt',
      {
        type: Sequelize.DATE,
        allowNull: true,
        validate: {
        }
      }
    )])
  },

  down: (queryInterface) => {
    return Promise.all([queryInterface.removeColumn('Skills', 'deletedAt'),
      queryInterface.removeColumn('ProfileSkills', 'deletedAt')])
  }
}
