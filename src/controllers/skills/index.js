import SkillService from '../../services/skills'
import baseController from '../index'
import {findObjectOr404} from '../utils'

const skillService = new SkillService()

module.exports = {
  skillController: baseController('skill', skillService),
  findObjectOr404: findObjectOr404('skill', skillService)
}
