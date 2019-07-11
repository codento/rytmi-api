'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('profileProjectSkill', {
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
    await queryInterface.sequelize.query('ALTER TABLE "profileProjectSkill" ADD CONSTRAINT "pk_profileProjectSkill" PRIMARY KEY ("skillId", "profileProjectId")')
    return queryInterface.addIndex('profileProjectSkill', {
      fields: ['profileProjectId'],
      name: 'idx_profileprojectskill_profileprjectid'
    })
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('profileProjectSkill')
  }
}
