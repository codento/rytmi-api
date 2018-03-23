module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ProfileProjects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ProfileId: {
        allowNull: false,
        references: {
          model: 'Profiles',
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      ProjectId: {
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
      active: {
        allowNull: false,
        type: Sequelize.BOOLEAN
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
