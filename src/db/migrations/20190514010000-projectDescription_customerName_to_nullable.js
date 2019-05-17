module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('projectDescription', 'customerName', {
      allowNull: true,
      type: Sequelize.STRING
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('projectDescription', 'customerName', {
      allowNull: false,
      type: Sequelize.STRING
    })
  }
}
