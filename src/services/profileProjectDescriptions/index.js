import CrudService from '../crud'
import models from '../../db/models'

export default class ProfileProjectDescriptionService extends CrudService {
  constructor () {
    super(models.profileProjectDescription)
  }

  async getAll () {
    return models.profileProjectDescription.findAll()
  }

  async get (id) {
    return models.profileProjectDescription.findOne({where: {id: id}})
  }
}
