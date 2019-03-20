module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('profile', 'born', {
      allowNull: true,
      type: Sequelize.DATE,
      defaultValue: null
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('profile', 'born')
  }
}
