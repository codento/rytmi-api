const descriptionTemplate = { fi: null, en: null }

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn('profileProject', 'role', {
        defaultValue: JSON.stringify(descriptionTemplate),
        allowNull: true,
        type: Sequelize.JSONB
      }, { transaction: t })
      await queryInterface.sequelize.query(
        `UPDATE public."profileProject" AS p
        SET "role" = json_build_object(
          'fi', COALESCE((SELECT title FROM public."profileProjectDescription" d WHERE d."profileProjectId" = p.id AND "language"='fi'),''),
          'en', COALESCE((SELECT title FROM public."profileProjectDescription" d WHERE d."profileProjectId" = p.id AND "language"='en'),'')
          )`, { transaction: t })
      await queryInterface.dropTable('profileProjectDescription', { transaction: t })
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('profileProjectDescription', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        profileProjectId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        title: {
          type: Sequelize.STRING,
          allowNull: true
        },
        language: {
          type: Sequelize.STRING,
          allowNull: false
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }, { transaction: t })
      await queryInterface.sequelize.query(
        `INSERT INTO public."profileProjectDescription" ("profileProjectId", "title", "language", "createdAt", "updatedAt")
          SELECT id, role->>'fi', 'fi' AS language, NOW(), NOW()
          FROM public."profileProject" `, { transaction: t })
      await queryInterface.sequelize.query(
        `INSERT INTO public."profileProjectDescription" ("profileProjectId", "title", "language", "createdAt", "updatedAt")
          SELECT id, role->>'en', 'en' AS language, NOW(), NOW()
          FROM public."profileProject" `, { transaction: t })
      await queryInterface.removeColumn('profileProject', 'role', { transaction: t })
    })
  }
}
