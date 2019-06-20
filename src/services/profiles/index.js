import CrudService from '../crud'
import models from '../../db/models'

export default class ProfileService extends CrudService {
  constructor () {
    super(models.profile)
  }

  getProfileByUserId (userId) {
    return models.profile.findOne({where: {userId: userId}})
  }

  // Overrides CrudService's function
  delete () {
    throw new Error('Not implemented')
  }
}
