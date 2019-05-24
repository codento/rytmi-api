module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('profile', 'introduction', {
          allowNull: true,
          type: Sequelize.JSONB
        }, { transaction: t }),
        queryInterface.addColumn('profile', 'education', {
          allowNull: true,
          type: Sequelize.JSONB
        }, { transaction: t })
      ])
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('profile', 'introduction', { transaction: t }),
        queryInterface.removeColumn('profile', 'education', { transaction: t })
      ])
    })
  }
}
