module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('projectSkill', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      projectId: {
        allowNull: false,
        references: {
          model: 'project',
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      skillId: {
        allowNull: false,
        references: {
          model: 'skill',
          key: 'id'
        },
        type: Sequelize.INTEGER
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

  down: queryInterface => {
    return queryInterface.dropTable('projectSkill')
  }
}
