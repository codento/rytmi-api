module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Users', 'username'),
      queryInterface.removeColumn('Users', 'password'),
      queryInterface.addColumn('Users', 'googleId', {type: Sequelize.STRING, allowNull: false})
        .then(() => {
          queryInterface.addIndex('Users', {unique: true, fields: ['googleId']})
        }),
      queryInterface.addColumn('Users', 'firstName', Sequelize.STRING),
      queryInterface.addColumn('Users', 'lastName', Sequelize.STRING)
    ])
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Users', 'googleId'),
      queryInterface.removeColumn('Users', 'firstName'),
      queryInterface.removeColumn('Users', 'lastName'),
      queryInterface.addColumn('Users', 'password', {type: Sequelize.STRING, allowNull: false}),
      queryInterface.addColumn('Users', 'username', {type: Sequelize.STRING, allowNull: false, unique: true})
    ])
  }
}
