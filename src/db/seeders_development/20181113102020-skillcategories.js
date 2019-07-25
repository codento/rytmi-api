require('@babel/register')
require('@babel/polyfill')

const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(7331)

const groupTitles = [
  { en: 'Software development', fi: 'Sovelluskehitys' },
  { en: 'Management', fi: 'Manageeraus' },
  { en: 'Core knowlegde', fi: 'Ydintietämys' },
  { en: 'Understanding the number 42', fi: 'Numeron 42 ymmärrys' }
]
const categoryTitles = [
  { en: 'Mumbo Jumbo', fi: 'Hölyn pöly' },
  { en: 'AI frameworks', fi: 'Tekoälykehystystyöt' },
  { en: 'Big Databases', fi: 'Isot tietokannat' },
  { en: 'Working methods', fi: 'Työmetodit' },
  { en: 'Specifics of the number 42', fi: 'Numeron 42 erityispiirteet' },
  { en: 'Filaments of datastructure', fi: 'Datarakenteen säikeet' },
  { en: 'DevSecSpecOps', fi: 'KehTurvErikOpe' },
  { en: 'Backside of backend', fi: 'Takapään takapuoli' },
  { en: 'Mid-end', fi: 'Keskipää' }]

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
    return queryInterface.sequelize.transaction(async (transaction) => {
      const groups = groupTitles.map(title => factory.build('skillGroup', { title: JSON.stringify(title) }))
      await queryInterface.bulkInsert('skillGroup', groups, { transaction: transaction })
      const groupIds = await queryInterface.sequelize.query('SELECT "id" FROM "skillGroup"', { type: queryInterface.sequelize.QueryTypes.SELECT, transaction: transaction })
      const categories = []
      categoryTitles.forEach(title => {
        categories.push(factory.build('skillCategory', {
          title: JSON.stringify(title),
          skillGroupId: groupIds[faker.random.number(groupIds.length - 1)].id
        }))
      })
      await queryInterface.bulkInsert('skillCategory', categories, { transaction: transaction })
      const categoryIds = await queryInterface.sequelize.query('SELECT "id" FROM "skillCategory"', { type: queryInterface.sequelize.QueryTypes.SELECT, transaction: transaction })
      const skillIds = await queryInterface.sequelize.query('SELECT "id" FROM "skill"', { type: queryInterface.sequelize.QueryTypes.SELECT, transaction: transaction })
      skillIds.forEach(async id => {
        await queryInterface.sequelize.query(`UPDATE "skill" SET "skillCategoryId" = ${categoryIds[faker.random.number(categoryIds.length - 1)].id} WHERE "id" = ${id.id}`, { transaction: transaction })
      })
    })
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.query(`UPDATE "skill" SET "skillCategoryId" = 1`)
      await queryInterface.sequelize.query(`DELETE FROM "skillCategory" WHERE "title" != 'Uncategorized'`)
      return queryInterface.sequelize.query(`DELETE FROM "skillGroup" WHERE "title" != 'Uncategorized'`)
    } catch (e) {}
  }
}
