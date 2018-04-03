import { seederUmzug } from '../utils'
import models from '../../src/db/models'

const Op = models.sequelize.Op

describe('Seeding skills', () => {
  const skillSeeders = ['20180328102150-initial-skills', '20180328113116-add-lean-skills']
  skillSeeders.forEach(seeder => {
    it(`should import all skills from ${seeder}`, async () => {
      const migrations = await seederUmzug.up(seeder)
      expect(migrations.length).toBe(1)

      const seeded = require(migrations[0].path)

      const seededSkillNames = Object.keys(seeded.skills)
      const imported = await models.Skill
        .findAll({where: {name: {[Op.in]: seededSkillNames}}})
      expect(imported.length).toBe(seededSkillNames.length)
    })
  })
})
