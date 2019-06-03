import SkillService from '../../services/skills'
import baseController from '../index'
import {findObjectOr404, wrapAsync} from '../utils'
import ProfileSkillService from '../../services/profileSkills'
import ProjectSkillService from '../../services/projectSkills'

const skillService = new SkillService()
const profileSkillService = new ProfileSkillService()
const projectSkillService = new ProjectSkillService()

const skillController = baseController('skill', skillService)

const SEQUELIZE_UNIQUE_VIOLATION = '23505'

skillController.delete = wrapAsync(async (req, res) => {
  await skillService.delete(req.skill.id)
  res.status(204).send()
})

skillController.create = wrapAsync(async (req, res, next) => {
  const newSkill = req.body
  try {
    const result = await skillService.create(newSkill)
    res.status(201).json(result)
  } catch (error) {
    const [ softDeletedSkill ] = await skillService.getFiltered({name: newSkill.name}, false)
    if (hasSkillExistedBefore(softDeletedSkill, error)) {
      const reCreatedSkill = await reCreateDeletedSkill(softDeletedSkill, newSkill)
      res.status(201).json(reCreatedSkill)
    } else {
      next(error)
    }
  }
})

const hasSkillExistedBefore = (softDeletedSkill, error) =>
  softDeletedSkill && softDeletedSkill.dataValues.deletedAt !== null && error.parent.code === SEQUELIZE_UNIQUE_VIOLATION

const reCreateDeletedSkill = async (softDeletedSkill, newSkill) => {
  await profileSkillService.removeDeletedAt({ skillId: softDeletedSkill.id })
  await projectSkillService.removeDeletedAt({ skillId: softDeletedSkill.id })
  await skillService.removedDeletedAt(softDeletedSkill.id)
  return skillService.update(softDeletedSkill.id, newSkill)
}

module.exports = {
  skillController: skillController,
  findSkillOr404: findObjectOr404('skill', skillService)
}
