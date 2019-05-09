import CrudService from '../crud'
import models from '../../db/models'

export default class ProfileProjectDescriptionService extends CrudService {
  constructor () {
    super(models.profileProjectDescription)
  }

  // Overrides CrudService's function
  async getAll () {
    return models.profileProjectDescription.findAll()
  }

  // Overrides CrudService's function
  async get (id) {
    return models.profileProjectDescription.findOne({where: {id: id}})
  }
}
