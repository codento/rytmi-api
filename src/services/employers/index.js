import CrudService from '../crud'
import models from '../../db/models'

export default class EmployerService extends CrudService {
  constructor () {
    super(models.employer)
  }
}
