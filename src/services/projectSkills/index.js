import CrudService from '../crud'
import models from '../../db/models'

export default class ProjectSkillService extends CrudService {
  constructor () {
    super(models.projectSkill)
  }

  async getAll () {
    return models.projectSkill.findAll()
  }

  async get (id) {
    return models.projectSkill.findOne({where: {id: id}})
  }
}
