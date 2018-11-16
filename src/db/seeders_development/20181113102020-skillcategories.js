require('babel-register')
require('babel-polyfill')

const models = require('../models')
const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(7331)

const categoryTitles = [
  'Software development',
  'Management',
  'Core knowlegde',
  'Understanding the number 42'
]
const subCategoryTitles = [
  'Mumbo Jumbo',
  'AI frameworks',
  'Big Databases',
  'Working methods',
  'Specifics of the number 42',
  'Filaments of datastructure',
  'DevSecSpecOps',
  'Backside of backend',
  'Mid-end']

factory.define('skillCategory')
  .attr('title')
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

factory.define('skillSubcategory')
  .attr('title')
  .attr('categoryId')
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = categoryTitles.map(title => factory.build('skillCategory', { title }))
    await queryInterface.bulkInsert('SkillCategories', categories)
    const categoryModels = await models.SkillCategory.findAll()
    const subcategories = []
    subCategoryTitles.forEach(title => {
      subcategories.push(factory.build('skillSubcategory', {
        title: title,
        categoryId: categoryModels[faker.random.number(categoryModels.length - 1)].id
      }))
    })
    await queryInterface.bulkInsert('SkillSubcategories', subcategories)
    const subcategoryModels = await models.SkillSubcategory.findAll()
    const skills = await models.Skill.findAll()
    skills.forEach(skill => {
      skill.subcategoryId = subcategoryModels[faker.random.number(subcategoryModels.length - 1)].id
      skill.save()
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Skills', 'Skills_subcategoryId_fkey')
    await queryInterface.bulkDelete('SkillSubcategories')
    return queryInterface.bulkDelete('SkillCategories')
  }
}
