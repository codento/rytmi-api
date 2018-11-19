require('babel-register')
require('babel-polyfill')

const models = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SkillGroups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
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
    await queryInterface.createTable('SkillCategories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      SkillGroupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'SkillGroups',
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
    const group = await models.SkillGroup.create({title: 'Uncategorized'})
    await models.SkillCategory.create({SkillGroupId: group.id, title: 'Uncategorized'})
    return queryInterface.addColumn('Skills', 'SkillCategoryId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'SkillCategories',
        key: 'id'
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Skills', 'SkillCategoryId')
    await queryInterface.dropTable('SkillGroups')
    return queryInterface.dropTable('SkillCategories')
  }
}
