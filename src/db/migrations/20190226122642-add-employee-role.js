'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.createTable('employeeRole', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        title: {
          allowNull: false,
          type: Sequelize.STRING,
          unique: true
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
      return queryInterface.addColumn('profile', 'employeeRoleId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'employeeRole',
          key: 'id'
        },
        onDelete: 'SET NULL'
      })
    } catch (error) {
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('profile', 'employeeRoleId')
      return queryInterface.dropTable('employeeRole')
    } catch (error) {
      throw error
    }
  }
}
