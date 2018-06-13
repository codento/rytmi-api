module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex('ProfileProjects', {
      fields: ['endDate'],
      name: 'idx_profileprojects_enddate'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex('ProfileProjects', 'idx_profileprojects_enddate')
  }
}
