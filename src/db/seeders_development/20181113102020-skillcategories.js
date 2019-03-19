require('babel-register')
require('babel-polyfill')

const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(7331)

const groupTitles = [
  'Software development',
  'Management',
  'Core knowlegde',
  'Understanding the number 42'
]
const categoryTitles = [
  'Mumbo Jumbo',
  'AI frameworks',
  'Big Databases',
  'Working methods',
  'Specifics of the number 42',
  'Filaments of datastructure',
  'DevSecSpecOps',
  'Backside of backend',
  'Mid-end']

factory.define('skillGroup')
  .attr('title')
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

factory.define('skillCategory')
  .attr('title')
  .attr('skillGroupId')
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const groups = groupTitles.map(title => factory.build('skillGroup', { title }))
      await queryInterface.bulkInsert('skillGroup', groups)
      const groupIds = await queryInterface.sequelize.query('SELECT "id" FROM "skillGroup"', { type: queryInterface.sequelize.QueryTypes.SELECT })
      const categories = []
      categoryTitles.forEach(title => {
        categories.push(factory.build('skillCategory', {
          title: title,
          skillGroupId: groupIds[faker.random.number(groupIds.length - 1)].id
        }))
      })
      await queryInterface.bulkInsert('skillCategory', categories)
      const categoryIds = await queryInterface.sequelize.query('SELECT "id" FROM "skillCategory"', { type: queryInterface.sequelize.QueryTypes.SELECT })
      const skillIds = await queryInterface.sequelize.query('SELECT "id" FROM "skill"', { type: queryInterface.sequelize.QueryTypes.SELECT })
      skillIds.forEach(async id => {
        await queryInterface.sequelize.query(`UPDATE "skill" SET "skillCategoryId" = ${categoryIds[faker.random.number(categoryIds.length - 1)].id} WHERE "id" = ${id.id}`)
      })
    } catch (e) {}
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.query(`UPDATE "skill" SET "skillCategoryId" = 1`)
      await queryInterface.sequelize.query(`DELETE FROM "skillCategory" WHERE "title" != 'Uncategorized'`)
      return queryInterface.sequelize.query(`DELETE FROM "skillGroup" WHERE "title" != 'Uncategorized'`)
    } catch (e) {}
  }
}
