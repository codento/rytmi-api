import ProjectSkillService from '../../services/projectSkills'
import baseController from '../index'
import { findObjectOr404, wrapAsync } from '../utils'

const projectSkillService = new ProjectSkillService()

let projectSkillController = baseController('profileProjectDescription', projectSkillService)

projectSkillController.update = wrapAsync(async (req, res) => {
  const obj = await projectSkillService.update(req['profileProjectDescription'].id, req.body)
  res.json(obj)
})

projectSkillController.delete = wrapAsync(async (req, res) => {
  const action = await projectSkillService.delete(req.params.id)
  res.json(action)
})

projectSkillController.getAll = wrapAsync(async (req, res) => {
  const data = await projectSkillService.getAll(req, res)
  res.json(data)
})

module.exports = {
  projectSkillController: projectSkillController,
  findProjectSkillOr404: findObjectOr404('projectSkill', projectSkillService)
}
