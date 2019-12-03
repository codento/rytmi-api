'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.changeColumn(
        'user',
        'googleId',
        {
          type: Sequelize.STRING,
          allowNull: true
        },
        {transaction})
    })
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.changeColumn(
        'user',
        'googleId',
        {
          type: Sequelize.STRING,
          allowNull: false
        },
        {transaction})
    })
  }
}
