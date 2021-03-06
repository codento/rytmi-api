module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('employer', 'name', {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING
    })
    await queryInterface.removeColumn('employer', 'profileId')
    await queryInterface.removeColumn('employer', 'endDate')
    return queryInterface.removeColumn('employer', 'startDate')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('employer', 'name', {
      allowNull: false,
      unique: false,
      type: Sequelize.STRING
    })

    await queryInterface.addColumn('employer', 'profileId', {
      allowNull: false,
      references: {
        model: 'profile',
        key: 'id'
      },
      type: Sequelize.INTEGER
    })

    await queryInterface.addColumn('employer', 'startDate', {
      allowNull: false,
      references: {
        model: 'profile',
        key: 'id'
      },
      type: Sequelize.DATE
    })

    return queryInterface.addColumn('employer', 'endDate', {
      allowNull: true,
      references: {
        model: 'profile',
        key: 'id'
      },
      type: Sequelize.DATE
    })
  }
}
