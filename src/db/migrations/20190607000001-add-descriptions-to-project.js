const descriptionTemplate = { fi: null, en: null }

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn('project', 'name', {
        defaultValue: JSON.stringify(descriptionTemplate),
        allowNull: true,
        type: Sequelize.JSONB
      }, { transaction: transaction })
      await queryInterface.addColumn('project', 'customerName', {
        defaultValue: JSON.stringify(descriptionTemplate),
        allowNull: true,
        type: Sequelize.JSONB
      }, { transaction: transaction })
      await queryInterface.addColumn('project', 'description', {
        defaultValue: JSON.stringify(descriptionTemplate),
        allowNull: true,
        type: Sequelize.JSONB
      }, { transaction: transaction })
      await queryInterface.sequelize.query(
        `UPDATE public."project" AS p
        SET "name" = json_build_object(
          'fi', COALESCE((SELECT name FROM public."projectDescription" d WHERE d."projectId" = p.id AND "language"='fi'),''),
          'en', COALESCE((SELECT name FROM public."projectDescription" d WHERE d."projectId" = p.id AND "language"='en'),'')
          )
        `, { transaction: transaction })
      await queryInterface.sequelize.query(
        `UPDATE public."project" AS p
        SET "customerName" = json_build_object(
          'fi', COALESCE((SELECT "customerName" FROM public."projectDescription" d WHERE d."projectId" = p.id AND "language"='fi'),''),
          'en', COALESCE((SELECT "customerName" FROM public."projectDescription" d WHERE d."projectId" = p.id AND "language"='en'),'')
          )
        `, { transaction: transaction })
      await queryInterface.sequelize.query(
        `UPDATE public."project" AS p
        SET "description" = json_build_object(
          'fi', COALESCE((SELECT "description" FROM public."projectDescription" d WHERE d."projectId" = p.id AND "language"='fi'),''),
          'en', COALESCE((SELECT "description" FROM public."projectDescription" d WHERE d."projectId" = p.id AND "language"='en'),'')
          )
        `, { transaction: transaction })
      await queryInterface.dropTable('projectDescription', { transaction: transaction })
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable('projectDescription', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        projectId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        name: {
          type: Sequelize.STRING,
          allowNull: true
        },
        customerName: {
          type: Sequelize.STRING,
          allowNull: true
        },
        description: {
          type: Sequelize.STRING(1000),
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
      }, { transaction: transaction })
      await queryInterface.sequelize.query(
        `INSERT INTO public."projectDescription" ("projectId", "name", "description", "customerName", "language", "createdAt", "updatedAt")
          SELECT id, name->>'fi', description->>'fi', "customerName"->>'fi', 'fi' AS language, NOW(), NOW()
          FROM public."project"`, { transaction: transaction })
      await queryInterface.sequelize.query(
        `INSERT INTO public."projectDescription" ("projectId", "name", "description", "customerName", "language", "createdAt", "updatedAt")
          SELECT id, name->>'en', description->>'en', "customerName"->>'en', 'en' AS language, NOW(), NOW()
          FROM public."project"`, { transaction: transaction })
      await queryInterface.removeColumn('project', 'name', { transaction: transaction })
      await queryInterface.removeColumn('project', 'customerName', { transaction: transaction })
      await queryInterface.removeColumn('project', 'description', { transaction: transaction })
    })
  }
}
