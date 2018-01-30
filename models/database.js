require('dotenv').config()

let schema = require('bookshelf-schema')
let client = require('knex')
let knex

knex = client({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  }
})

let Bookshelf = require('bookshelf')(knex)
Bookshelf.plugin('registry')
Bookshelf.plugin(schema)
module.exports = Bookshelf
