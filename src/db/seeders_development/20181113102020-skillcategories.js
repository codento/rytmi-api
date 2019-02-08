require('babel-register')
require('babel-polyfill')

const models = require('../models')
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
    const groups = groupTitles.map(title => factory.build('skillGroup', { title }))
    await queryInterface.bulkInsert('skillGroup', groups)
    const groupModels = await models.skillGroup.findAll()
    const categories = []
    categoryTitles.forEach(title => {
      categories.push(factory.build('skillCategory', {
        title: title,
        skillGroupId: groupModels[faker.random.number(groupModels.length - 1)].id
      }))
    })
    await queryInterface.bulkInsert('skillCategory', categories)
    const categoryModels = await models.skillCategory.findAll()
    const skills = await models.skill.findAll()
    skills.forEach(skill => {
      skill.skillCategoryId = categoryModels[faker.random.number(categoryModels.length - 1)].id
      skill.save()
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('skill', 'Skills_skillCategoryId_fkey')
    await queryInterface.bulkDelete('skillCategory')
    return queryInterface.bulkDelete('skillGroup')
  }
}
