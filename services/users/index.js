import CrudService from '../crud'
import models from '../../db/models'

export default class UserService extends CrudService {
  constructor () {
    super(models.User)
  }

  delete () {
    throw new Error('Not implemented')
  }
}
