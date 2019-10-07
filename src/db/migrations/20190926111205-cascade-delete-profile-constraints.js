'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeConstraint(
        'profileEmployer',
        'profileEmployer_profileId_fkey',
        {transaction})
      await queryInterface.addConstraint(
        'profileEmployer', ['profileId'],
        {
          transaction,
          type: 'foreign key',
          references: {
            table: 'profile',
            field: 'id'
          },
          onDelete: 'cascade'
        })
    })
  },
  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeConstraint(
        'profileEmployer',
        'profileEmployer_profileId_profile_fk',
        {transaction})
      await queryInterface.addConstraint(
        'profileEmployer', ['profileId'],
        {
          transaction,
          name: 'profileEmployer_profileId_fkey',
          type: 'foreign key',
          references: {
            table: 'profile',
            field: 'id'
          }
        })
    })
  }
}
