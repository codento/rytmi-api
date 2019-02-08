'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Skills-table
    // 1) drop constraint
    await queryInterface.removeConstraint('Skills', 'Skills_SkillCategoryId_fkey')

    // 2) rename column
    await queryInterface.renameColumn('Skills', 'SkillCategoryId', 'skillCategoryId')

    // 3) add constraint back
    await queryInterface.addConstraint('Skills', ['skillCategoryId'], {
      type: 'foreign key',
      name: 'Skills_skillCategoryId_fkey',
      references: {
        table: 'SkillCategories',
        field: 'id'
      }
    })

    // Do the same for SkillCategories-table
    await queryInterface.removeConstraint('SkillCategories', 'SkillCategories_SkillGroupId_fkey')
    await queryInterface.renameColumn('SkillCategories', 'SkillGroupId', 'skillGroupId')
    return queryInterface.addConstraint('SkillCategories', ['skillGroupId'], {
      type: 'foreign key',
      name: 'SkillCategories_skillGroupId_fkey',
      references: {
        table: 'SkillGroups',
        field: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    // Skills-table
    // 1) drop constraint
    await queryInterface.removeConstraint('Skills', 'Skills_SkillCategoryId_fkey')

    // 2) rename column
    await queryInterface.renameColumn('Skills', 'skillCategoryId', 'SkillCategoryId')

    // 3) add constraint back
    await queryInterface.addConstraint('Skills', ['SkillCategoryId'], {
      type: 'foreign key',
      name: 'Skills_skillCategoryId_fkey',
      references: {
        table: 'SkillCategories',
        field: 'id'
      }
    })

    // Do the same for SkillCategories-table
    await queryInterface.removeConstraint('SkillCategories', 'SkillCategories_SkillGroupId_fkey')
    await queryInterface.renameColumn('SkillCategories', 'skillGroupId', 'SkillGroupId')
    return queryInterface.addConstraint('SkillCategories', ['SkillGroupId'], {
      type: 'foreign key',
      name: 'SkillCategories_skillGroupId_fkey',
      references: {
        table: 'SkillGroups',
        field: 'id'
      }
    })
  }
}
