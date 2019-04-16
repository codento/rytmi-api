import CrudService from '../crud'
import models from '../../db/models'

export default class ProjectSkillService extends CrudService {
  constructor () {
    super(models.projectSkill)
  }

  async getAll (req, res) {
    const options = req.query.projectId ? { where: { projectId: req.query.projectId } } : undefined
    return models.projectSkill.findAll(options)
  }

  async get (id) {
    return models.projectSkill.findOne({where: {id: id}})
  }
}
