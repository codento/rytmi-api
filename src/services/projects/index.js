import CrudService from '../crud'
import models from '../../db/models'

export default class ProjectService extends CrudService {
  constructor () {
    super(models.Project)
  }

  getByProjectId (projectId) {
    return models.Project.findOne({where: {id: projectId}})
  }

  getAll () {
    return models.Project.findAll()
  }

}
