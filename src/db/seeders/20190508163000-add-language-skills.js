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
    try {
      let skillGroups = await [factory.build('skillGroup', {title: 'Language'})]
      await queryInterface.bulkInsert('skillGroup', skillGroups)
      const languageSkillGroups = await queryInterface.sequelize.query('SELECT * FROM "skillGroup" WHERE "title"=\'Language\'', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
      console.log(languageSkillGroups)
      let skillCategories = await [factory.build('skillCategory', {title: 'Language', skillGroupId: languageSkillGroups[0].id})]
      await queryInterface.bulkInsert('skillCategory', skillCategories)

      const languageSkillCategories = await queryInterface.sequelize.query('SELECT * FROM "skillCategory" WHERE "title"=\'Language\'', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
      console.log(languageSkillCategories)
      const skillCategoryId = languageSkillCategories[0].id
      let languageSkills = await [factory.build('skill', {name: 'Finnish', description: 'Finnish language', skillCategoryId}),
        factory.build('skill', {name: 'English', description: 'English language', skillCategoryId}),
        factory.build('skill', {name: 'Swedish', description: 'Swedish language', skillCategoryId})]
      return queryInterface.bulkInsert('skill', languageSkills)
    } catch (e) {}
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
