module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('profile', 'birthYear', {
        type: Sequelize.DataTypes.INTEGER
      })
      const profiles = await queryInterface.sequelize.query('SELECT * FROM "profile"', { type: queryInterface.sequelize.QueryTypes.SELECT })
      const insertData = []
      for (let profile of profiles) {
        insertData.push(queryInterface.sequelize.query(`UPDATE "profile" SET "birthYear" = ${profile.birthday ? profile.birthday.getFullYear() : null} WHERE id = ${profile.id} `, { type: queryInterface.sequelize.QueryTypes.UPDATE }))
      }
      await Promise.all(insertData)
      return queryInterface.removeColumn('profile', 'birthday')
    } catch (e) {
      return e
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('profile', 'birthday', {
        type: Sequelize.DataTypes.DATE
      })
      return queryInterface.removeColumn('profile', 'birthYear')
    } catch (e) {
      return e
    }
  }
}
