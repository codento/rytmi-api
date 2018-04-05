import models from '../src/db/models'
import Umzug from 'umzug'

const sequelize = models.sequelize

export const migrationsUmzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize
  },
  migrations: {
    params: [
      sequelize.getQueryInterface(), // queryInterface
      sequelize.constructor // DataTypes
    ],
    path: 'src/db/migrations',
    pattern: /\.js$/
  }
})

export const seederUmzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize,
    modelName: 'SequelizeData'
  },
  migrations: {
    params: [
      sequelize.getQueryInterface(), // queryInterface
      sequelize.constructor // DataTypes
    ],
    path: 'src/db/seeders',
    pattern: /\.js$/
  }
})

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
