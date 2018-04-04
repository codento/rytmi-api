import fs from 'fs'
import path from 'path'
import models from '../src/db/models'
const sequelize = models.sequelize

export function requireModules (relativePath) {
  let fullPath = path.join(__dirname, relativePath)
  return fs.readdirSync(fullPath)
    .filter(file => (file.indexOf('.') !== 0) && (file.slice(-3) === '.js'))
    .map(file => require(path.join(fullPath, file)))
}

export function runMigrations (modules) {
  return modules.reduce((chain, migration) => {
    return chain.then(() => {
      return migration.up(sequelize.queryInterface, sequelize.Sequelize)
    })
  }, Promise.resolve())
}

export function truncate () {
  const tableNames = Object.keys(sequelize.models)
  return sequelize.query(
    `TRUNCATE ${tableNames.map(name => `"${name}"`).join(', ')} CASCADE;`
  )
}

export function generatePost (request, endpoint) {
  return function (attrs) {
    return request
      .post(endpoint)
      .send(attrs)
      .expect(201)
      .then(response => response.body)
  }
}

export function endpointAuthorizationTest (requestMethod, path) {
  return it(`should return 401 for ${path} without valid jwt`, async () => {
    return requestMethod(path)
      .expect(401)
  })
}
