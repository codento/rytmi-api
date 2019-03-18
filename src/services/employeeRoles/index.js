import CrudService from '../crud'
import models from '../../db/models'

export default class EmployeeRoleService extends CrudService {
  constructor () {
    super(models.employeeRole)
  }
}
