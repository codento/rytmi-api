const descriptionTemplate = { fi: null, en: null }

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('project', 'name', {
          defaultValue: JSON.stringify(descriptionTemplate),
          allowNull: true,
          type: Sequelize.JSONB
        }, { transaction: t }),
        queryInterface.addColumn('project', 'customerName', {
          defaultValue: JSON.stringify(descriptionTemplate),
          allowNull: true,
          type: Sequelize.JSONB
        }, { transaction: t }),
        queryInterface.addColumn('project', 'description', {
          defaultValue: JSON.stringify(descriptionTemplate),
          allowNull: true,
          type: Sequelize.JSONB
        }, { transaction: t })
      ])
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('project', 'name', { transaction: t }),
        queryInterface.removeColumn('project', 'customerName', { transaction: t }),
        queryInterface.removeColumn('project', 'description', { transaction: t })
      ])
    })
  }
}
