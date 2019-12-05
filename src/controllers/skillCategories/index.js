import SkillCategoryService from '../../services/skillCategories'
import baseController from '../index'
import {findObjectOr404, wrapAsync} from '../utils'

const skillCategoryService = new SkillCategoryService()

let skillCategoryController = baseController('skillcategory', skillCategoryService)

skillCategoryController.delete = wrapAsync(async (req, res) => {
  try {
    await skillCategoryService.delete(req.params.id)
    res.status(204).send()
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      const skills = await skillCategoryService.getSkillsForCategory(req.params.id)
      error.details = { skills: skills.map(skill => skill.get()) }
      error.message = error.name
    }
    throw error
  }
})

module.exports = {
  skillCategoryController: skillCategoryController,
  findSkillCategoryOr404: findObjectOr404('skillcategory', skillCategoryService)
}
