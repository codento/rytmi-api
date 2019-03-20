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
      return queryInterface.addColumn('profile', 'employeeRoles', {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
      })
    } catch (error) {
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('profile', 'employeeRoles')
      return queryInterface.dropTable('employeeRole')
    } catch (error) {
      throw error
    }
  }
}
