module.exports = {
  up: (queryInterface) => {
    return queryInterface.dropTable('employerDescription')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.createTable('employerDescription', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
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
  }
}
