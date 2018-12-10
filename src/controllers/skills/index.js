import SkillService from '../../services/skills'
import baseController from '../index'
import {findObjectOr404, wrapAsync} from '../utils'

const skillService = new SkillService()

let skillController = baseController('skill', skillService)

skillController.delete = wrapAsync(async (req, res) => {
  await skillService.delete(req.skill.id)
  res.status(204).send()
})

module.exports = {
  skillController: skillController,
  findSkillOr404: findObjectOr404('skill', skillService)
}
