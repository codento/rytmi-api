import CrudService from '../crud'
import models from '../../db/models'

export default class UserService extends CrudService {
  constructor () {
    super(models.User)
  }

  getByGoogleId (googleId) {
    return models.User
      .findAll({where: {googleId: googleId}})
  }

  delete () {
    throw new Error('Not implemented')
  }
}
