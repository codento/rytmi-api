module.exports = {
  up: (queryInterface) => {
    return queryInterface.removeColumn('profileProject', 'title')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('profileProject', 'title', Sequelize.STRING)
  }
}
