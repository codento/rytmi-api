import CrudService from '../crud'
import models from '../../db/models'

export default class LeaveService extends CrudService {
  constructor () {
    super(models.leave)
  }

  delete (id) {
    return models.leave.destroy({ where: { id } })
  }

  create (attrs) {
    delete attrs.id
    return models.leave
      .create(attrs)
      .then(created => this.get(created.id))
  }
}
