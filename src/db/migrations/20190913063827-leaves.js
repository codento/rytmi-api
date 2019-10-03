module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable('leave', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        affectsUtilisation: Sequelize.BOOLEAN,
        description: {
          allowNull: false,
          type: Sequelize.TEXT,
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
      }, { transaction: transaction })

      await queryInterface.createTable('absence', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        leaveId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'leave',
            key: 'id'
          }
        },
        profileId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'profile',
            key: 'id'
          }
        },
        startDate: {
          type: Sequelize.DATE,
          allowNull: true
        },
        endDate: {
          type: Sequelize.DATE,
          allowNull: true
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }, { transaction: transaction })
    })
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('absence', { transation: transaction })
      await queryInterface.dropTable('leave', { transation: transaction })
    })
  }
}
