module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.changeColumn('project', 'isConfidential', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }, { transaction })
      await queryInterface.sequelize.query(
        `UPDATE "project" SET "isConfidential" = true`,
        { transaction: transaction })
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('project', 'isConfidential', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
  }
}
