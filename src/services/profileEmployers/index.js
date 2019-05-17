import CrudService from '../crud'
import models from '../../db/models'

export default class ProfileEmployerService extends CrudService {
  constructor () {
    super(models.profileEmployer)
  }
}
