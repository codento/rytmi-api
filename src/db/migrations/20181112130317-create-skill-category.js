require('@babel/register')
require('@babel/polyfill')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SkillGroups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
    await queryInterface.createTable('SkillCategories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      SkillGroupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'SkillGroups',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
    const now = new Date().toISOString()
    await queryInterface.sequelize.query('INSERT INTO public."SkillGroups" ("id", "title", "createdAt", "updatedAt") VALUES (DEFAULT, \'Uncategorized\', \'' + now + '\', \'' + now + '\') RETURNING *', {
      type: queryInterface.sequelize.QueryTypes.INSERT
    })

    const groupIdQueryResult = await queryInterface.sequelize.query('SELECT id from public."SkillGroups" WHERE title=\'Uncategorized\'', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })

    await queryInterface.sequelize.query('INSERT INTO public."SkillCategories" ("id", "title", "SkillGroupId", "createdAt", "updatedAt") VALUES (DEFAULT, \'Uncategorized\', ' + groupIdQueryResult[0].id + ', \'' + now + '\', \'' + now + '\') RETURNING *', {
      type: queryInterface.sequelize.QueryTypes.INSERT
    })

    return queryInterface.addColumn('Skills', 'SkillCategoryId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'SkillCategories',
        key: 'id'
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Skills', 'skillCategoryId')
    await queryInterface.dropTable('SkillGroups')
    return queryInterface.dropTable('SkillCategories')
  }
}
