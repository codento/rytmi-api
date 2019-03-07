'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeConstraint(
        'profileSkill',
        'ProfileSkills_profileId_fkey'),
      queryInterface.removeConstraint(
        'profileProject',
        'ProfileProjects_profileId_fkey')
    ]).then(() => Promise.all([
      queryInterface.addConstraint(
        'profileSkill', ['profileId'],
        {
          type: 'foreign key',
          references: {
            table: 'profile',
            field: 'id'
          },
          onDelete: 'cascade'
        }),
      queryInterface.addConstraint(
        'profileProject', ['profileId'],
        {
          type: 'foreign key',
          references: {
            table: 'profile',
            field: 'id'
          },
          onDelete: 'cascade'
        }
      )
    ]))
  },
  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeConstraint(
        'profileSkill',
        'profileSkill_profileId_profile_fk'),
      queryInterface.removeConstraint(
        'profileProject',
        'profileProject_profileId_profile_fk')
    ]).then(() => Promise.all([
      queryInterface.addConstraint(
        'profileSkill', ['profileId'],
        {
          name: 'ProfileSkills_profileId_fkey',
          type: 'foreign key',
          references: {
            table: 'profile',
            field: 'id'
          }
        }),
      queryInterface.addConstraint(
        'profileProject', ['profileId'],
        {
          name: 'ProfileProjects_profileId_fkey',
          type: 'foreign key',
          references: {
            table: 'profile',
            field: 'id'
          }
        }
      )
    ]))
      .catch(error => {
        console.log(error, error.parent)
        throw error
      })
  }
}
