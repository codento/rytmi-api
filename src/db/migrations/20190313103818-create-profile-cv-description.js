module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('profileCvDescription', {
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
      description: {
        type: Sequelize.STRING
      },
      language: {
        allowNull: false,
        type: Sequelize.STRING
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING
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
    return queryInterface.dropTable('profileCvDescription')
  }
}
