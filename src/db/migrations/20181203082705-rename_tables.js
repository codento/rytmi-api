'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('Users', 'user')
    await queryInterface.renameTable('SkillCategories', 'skillCategory')
    await queryInterface.renameTable('SkillGroups', 'skillGroup')
    await queryInterface.renameTable('ProfileProjects', 'profileProject')
    await queryInterface.renameTable('Projects', 'project')
    await queryInterface.renameTable('Profiles', 'profile')
    await queryInterface.renameTable('ProfileSkills', 'profileSkill')
    return queryInterface.renameTable('Skills', 'skill')
  },

  down: (queryInterface, Sequelize) => {
    // TODO
  }
}
