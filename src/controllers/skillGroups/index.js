import SkillGroupService from '../../services/skillGroups'
import baseController from '../index'
import {findObjectOr404, wrapAsync} from '../utils'

const skillGroupService = new SkillGroupService()

let skillGroupController = baseController('skillgroup', skillGroupService)

skillGroupController.delete = wrapAsync(async (req, res) => {
  await skillGroupService.delete(req.params.id)
  res.status(204).send()
})

module.exports = {
  skillGroupController: skillGroupController,
  findSkillGroupOr404: findObjectOr404('skillgroup', skillGroupService)

}
