import { seederUmzug } from '../utils'
import models from '../../src/db/models'

const Op = models.sequelize.Op

describe('Seeding skills', () => {
  const skillSeeders = [
    '20180328102150-initial-skills',
    '20180328113116-add-lean-skills',
    '20180404151000-add-more-skills'
  ]

  skillSeeders.forEach(seederId => {
    it(`should import all skills from ${seederId}`, async () => {
      const migrations = await seederUmzug.up(seederId)
      expect(migrations.length).toBe(1)

      const seeder = require(migrations[0].path)
      const seederSkillNames = Object.keys(seeder.skills)
      const imported = await models.Skill
        .findAll({where: {name: {[Op.in]: seederSkillNames}}})

      expect(imported.length).toBe(seederSkillNames.length)
      imported.forEach(importedSkill => {
        expect(importedSkill.description).toBe(seeder.skills[importedSkill.name])
      })
    })
  })
})
