import CrudService from '../crud'
import models from '../../db/models'

export default class SkillService extends CrudService {
  constructor () {
    super(models.Skill)
  }
}
