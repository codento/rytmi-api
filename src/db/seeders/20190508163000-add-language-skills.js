const rosie = require('rosie')
const factory = rosie.Factory

factory.define('skillGroup')
  .attr('title')
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

factory.define('skillCategory')
  .attr('title')
  .attr('skillGroupId')
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

factory.define('skill')
  .attr('name')
  .attr('description')
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())
  .attr('skillCategoryId')

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      let skillGroups = await [factory.build('skillGroup', { title: JSON.stringify({ en: 'Language', fi: 'Kieli' }) })]
      await queryInterface.bulkInsert('skillGroup', skillGroups)

      const languageSkillGroups = await queryInterface.sequelize.query('SELECT * FROM "skillGroup" WHERE "title"->>\'en\'=\'Language\'', {
        type: queryInterface.sequelize.QueryTypes.SELECT,
        transaction: transaction
      })

      let skillCategories = await [factory.build('skillCategory', {title: JSON.stringify({ en: 'Language', fi: 'Kieli' }), skillGroupId: languageSkillGroups[0].id})]
      await queryInterface.bulkInsert('skillCategory', skillCategories, { transaction: transaction })

      const languageSkillCategories = await queryInterface.sequelize.query('SELECT * FROM "skillCategory" WHERE "title"->>\'en\'=\'Language\'', {
        type: queryInterface.sequelize.QueryTypes.SELECT,
        transaction: transaction
      })

      const skillCategoryId = languageSkillCategories[0].id
      let languageSkills = await [factory.build('skill', { name: JSON.stringify({fi: 'suomi', en: 'Finnish'}), description: JSON.stringify({fi: '', en: 'Finnish language'}), skillCategoryId }),
        factory.build('skill', { name: JSON.stringify({fi: 'englanti', en: 'English'}), description: JSON.stringify({fi: '', en: 'English language'}), skillCategoryId }),
        factory.build('skill', { name: JSON.stringify({fi: 'ruotsi', en: 'Swedish'}), description: JSON.stringify({fi: '', en: 'Swedish language'}), skillCategoryId })]
      await queryInterface.bulkInsert('skill', languageSkills, { transaction: transaction })
    })
  },

  down: async (queryInterface) => {
    try {
      const languageSkillCategories = await queryInterface.sequelize.query('SELECT * FROM "skillCategory" WHERE "title"=\'Language\'', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
      await queryInterface.bulkDelete('skill', {where: {skillCategoryId: languageSkillCategories[0].id}})
      await queryInterface.bulkDelete('skillCategory', {where: {id: languageSkillCategories[0].id}})
      return queryInterface.bulkDelete('skillGroup', {where: {id: languageSkillCategories[0].skillGroupId}})
    } catch (e) {}
  }
}
