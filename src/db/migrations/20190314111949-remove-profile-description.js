module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('profile', 'description')
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('profile', 'description', Sequelize.STRING)
  }
}
