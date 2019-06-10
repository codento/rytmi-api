const descriptionTemplate = { fi: null, en: null }

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('profileProject', 'role', {
      defaultValue: JSON.stringify(descriptionTemplate),
      allowNull: false,
      type: Sequelize.JSONB
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('profileProject', 'role')
  }
}
