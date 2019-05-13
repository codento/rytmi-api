require('dotenv').config()

module.exports = {
  development: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: 'postgres',
    operatorsAliases: false,
    seederStorage: 'sequelize',
    logging: false,
    define: {
      freezeTableName: true
    }
  },
  test: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME + '_test',
    dialect: 'postgres',
    operatorsAliases: false,
    seederStorage: 'sequelize',
    logging: console.log,
    define: {
      freezeTableName: true
    }
  },
  production: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: 'postgres',
    operatorsAliases: false,
    seederStorage: 'sequelize',
    define: {
      freezeTableName: true
    }
  }
}
