module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('profileProjectDescription', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      profileProjectId: {
        allowNull: false,
        references: {
          model: 'profileProject',
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      language: {
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
    return queryInterface.dropTable('profileProjectDescription')
  }
}
