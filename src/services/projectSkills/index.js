import CrudService from '../crud'
import models from '../../db/models'

export default class ProjectSkillService extends CrudService {
  constructor () {
    super(models.projectSkill)
  }
}
