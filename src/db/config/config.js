require('dotenv').config()

module.exports = {
  development: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: 'postgres',
    operatorsAliases: false,
    seederStorage: 'sequelize'
  },
  test: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME + '_test',
    dialect: 'postgres',
    operatorsAliases: false,
    logging: false,
    seederStorage: 'sequelize'
  },
  production: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: 'postgres',
    operatorsAliases: false,
    seederStorage: 'sequelize'
  }
}
