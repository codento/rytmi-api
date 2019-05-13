'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeConstraint('profileCvDescription', 'profileCvDescription_profileId_fkey'),
      queryInterface.removeConstraint('employer', 'employer_profileId_fkey'),
      queryInterface.removeConstraint('employerDescription', 'employerDescription_employerId_fkey'),
      queryInterface.removeConstraint('profileProjectDescription', 'profileProjectDescription_profileProjectId_fkey')
    ]).catch(e => e)
    return Promise.all([
      queryInterface.addConstraint('profileCvDescription', ['profileId'], {type: 'foreign key', references: {table: 'profile', field: 'id'}, onDelete: 'cascade'}),
      queryInterface.addConstraint('employer', ['profileId'], {type: 'foreign key', references: {table: 'profile', field: 'id'}, onDelete: 'cascade'}),
      queryInterface.addConstraint('employerDescription', ['employerId'], {type: 'foreign key', references: {table: 'employer', field: 'id'}, onDelete: 'cascade'}),
      queryInterface.addConstraint('profileProjectDescription', ['profileProjectId'], {type: 'foreign key', references: {table: 'profileProject', field: 'id'}, onDelete: 'cascade'})
    ]).catch(e => e)
  },
  down: async (queryInterface) => {
    await Promise.all([
      queryInterface.removeConstraint('profileCvDescription', 'profileCvDescription_profileId_fkey'),
      queryInterface.removeConstraint('employer', 'employer_profileId_fkey'),
      queryInterface.removeConstraint('employerDescription', 'employerDescription_employerId_fkey'),
      queryInterface.removeConstraint('profileProjectDescription', 'profileProjectDescription_profileProjectId_fkey')
    ]).catch(e => e)
    return Promise.all([
      queryInterface.addConstraint('profileCvDescription', ['profileId'], {type: 'foreign key', references: {table: 'profile', field: 'id'}}),
      queryInterface.addConstraint('employer', ['profileId'], {type: 'foreign key', references: {table: 'profile', field: 'id'}}),
      queryInterface.addConstraint('employerDescription', ['employerId'], {type: 'foreign key', references: {table: 'employer', field: 'id'}}),
      queryInterface.addConstraint('profileProjectDescription', ['profileProjectId'], {type: 'foreign key', references: {table: 'profileProject', field: 'id'}})
    ]).catch(e => e)
  }
}