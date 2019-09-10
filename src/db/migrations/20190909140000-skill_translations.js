'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.renameColumn('skill', 'name', 'oldName', { transaction: transaction })
      await queryInterface.renameColumn('skill', 'description', 'oldDescription', { transaction: transaction })
      await queryInterface.addColumn('skill', 'name', {
        type: Sequelize.JSONB
      }, { transaction: transaction })
      await queryInterface.addColumn('skill', 'description', {
        type: Sequelize.JSONB
      }, { transaction: transaction })
      await queryInterface.sequelize.query(
        `UPDATE "skill" AS s
           SET "name" = json_build_object(
             'fi', (SELECT "oldName" FROM "skill" c WHERE c."id" = s."id"),
             'en', (SELECT "oldName" FROM "skill" c WHERE c."id" = s."id")
             )
        `, { transaction: transaction })
      await queryInterface.sequelize.query(
        `UPDATE "skill" AS s
           SET "description" = json_build_object(
             'fi', (SELECT "oldDescription" FROM "skill" c WHERE c."id" = s."id"),
             'en', (SELECT "oldDescription" FROM "skill" c WHERE c."id" = s."id")
             )
        `, { transaction: transaction })

      await queryInterface.sequelize.query(`ALTER TABLE "skill" ALTER COLUMN name SET NOT NULL`, { transaction: transaction })
      await queryInterface.sequelize.query(`CREATE UNIQUE INDEX skill_name_fi_idx ON "skill"( (name->>'fi') )`, { transaction: transaction })
      await queryInterface.sequelize.query(`CREATE UNIQUE INDEX skill_name_en_idx ON "skill"( (name->>'en') )`, { transaction: transaction })
      await queryInterface.removeColumn('skill', 'oldName', { transaction: transaction })
      await queryInterface.removeColumn('skill', 'oldDescription', { transaction: transaction })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.renameColumn('skill', 'name', 'oldName', { transaction: transaction })
      await queryInterface.renameColumn('skill', 'description', 'oldDescription', { transaction: transaction })
      await queryInterface.addColumn('skill', 'name', {
        type: Sequelize.STRING
      }, { transaction: transaction })
      await queryInterface.addColumn('skill', 'description', {
        type: Sequelize.TEXT
      }, { transaction: transaction })
      await queryInterface.sequelize.query(
        `UPDATE "skill" AS s
           SET "name" = (SELECT "oldName"->>'en' FROM "skill" c WHERE c."id" = s."id")`, { transaction: transaction })
      await queryInterface.sequelize.query(
        `UPDATE "skill" AS s
           SET "description" = (SELECT "oldDescription"->>'en' FROM "skill" c WHERE c."id" = s."id")`, { transaction: transaction })
      await queryInterface.removeIndex('skill', 'skill_name_fi_idx', { transaction: transaction })
      await queryInterface.removeIndex('skill', 'skill_name_en_idx', { transaction: transaction })
      await queryInterface.changeColumn('skill', 'name',
        {
          type: Sequelize.STRING,
          allowNull: false
        },
        { transaction: transaction }
      )
      await queryInterface.removeColumn('skill', 'oldName', { transaction: transaction })
      await queryInterface.removeColumn('skill', 'oldDescription', { transaction: transaction })
      await queryInterface.sequelize.query(`ALTER TABLE "skill" ADD CONSTRAINT "skill_name_uniq" UNIQUE ("name")`, { transaction: transaction })
    })
  }
}
