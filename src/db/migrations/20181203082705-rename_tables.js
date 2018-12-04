'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('Projects', 'project')
    await queryInterface.renameTable('Profiles', 'profile')
    await queryInterface.renameTable('ProfileSkills', 'profileSkill')
    return queryInterface.renameTable('Skills', 'skill')
  },

  down: (queryInterface, Sequelize) => {
    // TODO
  }
}
