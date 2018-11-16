require('babel-register')
require('babel-polyfill')

const models = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
    await queryInterface.createTable('SkillSubcategories', {
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
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'SkillCategories',
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
    const category = await models.SkillCategory.create({title: 'Uncategorized'})
    await models.SkillSubcategory.create({categoryId: category.id, title: 'Uncategorized'})
    return queryInterface.addColumn('Skills', 'subcategoryId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'SkillSubcategories',
        key: 'id'
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Skills', 'subcategoryId')
    await queryInterface.dropTable('SkillSubcategories')
    return queryInterface.dropTable('SkillCategories')
  }
}
