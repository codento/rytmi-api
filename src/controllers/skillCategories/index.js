import SkillCategoryService from '../../services/skillCategories'
import baseController from '../index'
import {findObjectOr404, wrapAsync} from '../utils'

const skillCategoryService = new SkillCategoryService()

let skillCategoryController = baseController('skillcategory', skillCategoryService)

skillCategoryController.delete = wrapAsync(async (req, res) => {
  await skillCategoryService.delete(req.params.id)
  res.status(204).send()
})

module.exports = {
  skillCategoryController: skillCategoryController,
  findSkillCategoryOr404: findObjectOr404('skillcategory', skillCategoryService)
}
