module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex('ProfileProjects', {
      fields: ['profileId', 'projectId', 'startDate'],
      unique: true,
      name: 'profileId-projectId-startDate-index',
      type: 'UNIQUE'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex('ProfileProjects', 'profileId-projectId-startDate-index')
  }
}
