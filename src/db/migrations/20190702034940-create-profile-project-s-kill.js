'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('profileProjectSkill', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      profileProjectId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'profileProject',
          key: 'id'
        }
      },
      skillId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'skill',
          key: 'id'
        }
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
    return queryInterface.addIndex('profileProjectSkill', {
      fields: ['profileProjectId'],
      name: 'idx_profileprojectskill_profileprjectid'
    })
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('profileProjectSkill')
  }
}
