import CrudService from '../crud'
import models from '../../db/models'

export default class ProfileService extends CrudService {
  constructor () {
    super(models.Profile)
  }

  getByUserId (userId) {
    return models.Profile
      .findOne({where: {userId: userId}})
  }

  update (id, attrs) {
    delete attrs.userId
    return super.update(id, attrs)
  }

  delete () {
    throw new Error('Not implemented')
  }
}
