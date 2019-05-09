module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('project', 'isSecret', {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
    await queryInterface.removeColumn('project', 'name')
    return queryInterface.removeColumn('project', 'description')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('project', 'isSecret')
    await queryInterface.addColumn('project', 'name', Sequelize.STRING)
    return queryInterface.addColumn('project', 'description', Sequelize.STRING)
  }
}
