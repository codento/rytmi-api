module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ProfileProjects', {
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
      projectId: {
        allowNull: false,
        references: {
          model: 'Projects',
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      startAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      finishAt: {
        allewNull: true,
        type: Sequelize.DATE
      },
      workPercentage: {
        allowNull: false,
        type: Sequelize.INTEGER,
        min: 0,
        max: 100
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
    return queryInterface.dropTable('ProfileProjects')
  }
};
