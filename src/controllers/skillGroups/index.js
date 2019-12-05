import SkillGroupService from '../../services/skillGroups'
import baseController from '../index'
import {findObjectOr404, wrapAsync} from '../utils'

const skillGroupService = new SkillGroupService()

let skillGroupController = baseController('skillgroup', skillGroupService)

skillGroupController.delete = wrapAsync(async (req, res) => {
  try {

    await skillGroupService.delete(req.params.id)
    res.status(204).send()
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      const categories = await skillGroupService.getCategoriesForGroup(req.params.id)
      error.details = { categories: categories.map(category => category.get()) }
      error.message = error.name
    }
    throw error
  }
})

module.exports = {
  skillGroupController: skillGroupController,
  findSkillGroupOr404: findObjectOr404('skillgroup', skillGroupService)

}
