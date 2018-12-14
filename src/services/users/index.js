import CrudService from '../crud'
import models from '../../db/models'

export default class UserService extends CrudService {
  constructor () {
    super(models.user)
  }

  getByGoogleId (googleId) {
    return models.user
      .findOne({where: {googleId: googleId}})
  }

  delete () {
    throw new Error('Not implemented')
  }
}
