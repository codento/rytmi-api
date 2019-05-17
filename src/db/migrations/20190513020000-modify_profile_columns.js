module.exports = {
  up: (queryInterface) => {
    return queryInterface.removeColumn('profile', 'title')
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('profile', 'title', Sequelize.STRING)
  }
}
