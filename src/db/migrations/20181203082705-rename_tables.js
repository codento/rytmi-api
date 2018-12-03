'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('Profiles', 'profile')
    return queryInterface.renameTable('Skills', 'skill')
  },

  down: (queryInterface, Sequelize) => {
    // TODO
  }
}
