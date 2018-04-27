import CrudService from '../crud'
import models from '../../db/models'

export default class ProjectService extends CrudService {
  constructor () {
    super(models.Project)
  }
}
