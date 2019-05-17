'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeConstraint('profileCvDescription', 'profileCvDescription_profileId_fkey'),
      queryInterface.removeConstraint('profileProjectDescription', 'profileProjectDescription_profileProjectId_fkey')
    ]).catch(e => { console.log(e) })
    return Promise.all([
      queryInterface.addConstraint('profileCvDescription', ['profileId'], {type: 'foreign key', name: 'profileCvDescription_profileId_fkey', references: {table: 'profile', field: 'id'}, onDelete: 'cascade'}),
      queryInterface.addConstraint('profileProjectDescription', ['profileProjectId'], {type: 'foreign key', name: 'profileProjectDescription_profileProjectId_fkey', references: {table: 'profileProject', field: 'id'}, onDelete: 'cascade'})
    ]).catch(e => { console.log(e) })
  },
  down: async (queryInterface) => {
    await Promise.all([
      queryInterface.removeConstraint('profileCvDescription', 'profileCvDescription_profileId_fkey'),
      queryInterface.removeConstraint('profileProjectDescription', 'profileProjectDescription_profileProjectId_fkey')
    ]).catch(e => { console.log(e) })
    return Promise.all([
      queryInterface.addConstraint('profileCvDescription', ['profileId'], {type: 'foreign key', name: 'profileCvDescription_profileId_fkey', references: {table: 'profile', field: 'id'}}),
      queryInterface.addConstraint('profileProjectDescription', ['profileProjectId'], {type: 'foreign key', name: 'profileProjectDescription_profileProjectId_fkey', references: {table: 'profileProject', field: 'id'}})
    ]).catch(e => { console.log(e) })
  }
}
