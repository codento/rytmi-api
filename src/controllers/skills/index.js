import SkillService from '../../services/skills'
import baseController from '../index'
import {findObjectOr404} from '../utils'

const skillService = new SkillService()

const getLatestSkills = () => {
  return skillService.getAll()
}

module.exports = {
  skillController: baseController('skill', skillService),
  findSkillOr404: findObjectOr404('skill', skillService),
  getLatestSkills
}
