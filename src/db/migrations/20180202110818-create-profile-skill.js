module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ProfileSkills', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      profileId: {
        allowNull: false,
        references: {
          model: 'Profiles',
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      skillId: {
        allowNull: false,
        references: {
          model: 'Skills',
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      knows: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      wantsTo: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      visibleInCV: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      description: {
        type: Sequelize.TEXT
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ProfileSkills')
  }
}
