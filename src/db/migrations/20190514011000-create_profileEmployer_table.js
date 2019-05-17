module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('profileEmployer', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      profileId: {
        allowNull: false,
        references: {
          model: 'profile',
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      employerId: {
        allowNull: false,
        references: {
          model: 'employer',
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.JSONB
      },
      description: {
        type: Sequelize.JSONB
      },
      startDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      endDate: {
        allewNull: true,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('profileEmployer')
  }
}
