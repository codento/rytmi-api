'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.renameColumn('skillCategory', 'title', 'oldTitle', { transaction: transaction })
      await queryInterface.renameColumn('skillGroup', 'title', 'oldTitle', { transaction: transaction })
      await queryInterface.addColumn('skillCategory', 'title', {
        type: Sequelize.JSONB
      }, { transaction: transaction })
      await queryInterface.addColumn('skillGroup', 'title', {
        type: Sequelize.JSONB
      }, { transaction: transaction })
      await queryInterface.sequelize.query(
        `UPDATE "skillCategory" AS s
           SET "title" = json_build_object(
             'fi', '',
             'en', (SELECT "oldTitle" FROM "skillCategory" c WHERE c."id" = s."id")
             )
        `, { transaction: transaction })
      await queryInterface.sequelize.query(
        `UPDATE "skillGroup" AS s
           SET "title" = json_build_object(
             'fi', '',
             'en', (SELECT "oldTitle" FROM "skillGroup" c WHERE c."id" = s."id")
             )
        `, { transaction: transaction })
      await queryInterface.removeColumn('skillCategory', 'oldTitle', { transaction: transaction })
      await queryInterface.removeColumn('skillGroup', 'oldTitle', { transaction: transaction })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.renameColumn('skillCategory', 'title', 'oldTitle', { transaction: transaction })
      await queryInterface.renameColumn('skillGroup', 'title', 'oldTitle', { transaction: transaction })
      await queryInterface.addColumn('skillCategory', 'title', {
        type: Sequelize.STRING
      }, { transaction: transaction })
      await queryInterface.addColumn('skillGroup', 'title', {
        type: Sequelize.STRING
      }, { transaction: transaction })
      await queryInterface.sequelize.query(
        `UPDATE "skillCategory" AS s
           SET "title" = (SELECT "oldTitle"->>'en' FROM "skillCategory" c WHERE c."id" = s."id")`, { transaction: transaction })
      await queryInterface.sequelize.query(
        `UPDATE "skillGroup" AS s
           SET "title" = (SELECT "oldTitle"->>'en' FROM "skillGroup" c WHERE c."id" = s."id")`, { transaction: transaction })
      await queryInterface.removeColumn('skillCategory', 'oldTitle', { transaction: transaction })
      await queryInterface.removeColumn('skillGroup', 'oldTitle', { transaction: transaction })
    })
  }
}
