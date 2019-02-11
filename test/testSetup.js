require('babel-register')
require('babel-polyfill')

const { migrationsUmzug } = require('./utils')
const { user, profile } = require('../src/db/models/')
const { users, profiles } = require('./mockData/mockUsers')

module.exports = async function () {
  await executeMigrations()
  return insertTestUsersWithProfiles()
}

const executeMigrations = () => migrationsUmzug.up()

const insertTestUsersWithProfiles = async () => {
  await user.bulkCreate(users)
  await profile.bulkCreate(profiles)
}
