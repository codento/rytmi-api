const rosie = require('rosie')
const factory = rosie.Factory

factory.define('employer')
  .attr('name')
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

const companyName = 'Codento Oy'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const getCodentoRowQuery = 'SELECT * FROM "employer" WHERE "name"=\'' + companyName + '\''

    let codentoEmployerRows = await queryInterface.sequelize.query(getCodentoRowQuery, {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
    if (codentoEmployerRows.length === 0) {
      const employerCodento = await factory.build('employer', {name: companyName})
      await queryInterface.bulkInsert('employer', [employerCodento])
      codentoEmployerRows = await queryInterface.sequelize.query(getCodentoRowQuery, {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
    }

    const codentoEmployerRowId = codentoEmployerRows[0].id
    await queryInterface.addColumn('project', 'employerId', {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: codentoEmployerRowId,
      references: {
        model: 'employer',
        key: 'id'
      }
    })
    await queryInterface.addColumn('project', 'isInternal', {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: true
    })
    return queryInterface.changeColumn('project', 'code', {
      allowNull: false,
      unique: true,
      min: 0,
      type: Sequelize.INTEGER,
      validate: {
        customValidator (value) {
          if (value === null && this.isInternal) {
            throw new Error('Project.code cannot be null for internal projects.')
          }
        }
      }
    })
  },

  down: async (queryInterface) => {
    const getCodentoRowQuery = 'SELECT * FROM "employer" WHERE "name"=\'' + companyName + '\''

    let codentoEmployerRows = await queryInterface.sequelize.query(getCodentoRowQuery, {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
    await queryInterface.bulkDelete('project', {where: {id: codentoEmployerRows[0].id}})
    await queryInterface.removeColumn('project', 'isSecret')
    return queryInterface.removeColumn('project', 'isInternal')
  }
}
