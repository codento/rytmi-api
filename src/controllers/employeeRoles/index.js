import EmployeeRoleService from '../../services/employeeRoles'
import baseController from '../index'
import { findObjectOr404, wrapAsync } from '../utils'

const employeeRoleService = new EmployeeRoleService()

let employeeRoleController = baseController('employeeRole', employeeRoleService)

employeeRoleController.update = wrapAsync(async (req, res) => {
  const obj = await employeeRoleService.update(req['employeeRole'].id, req.body)
  res.json(obj)
})

employeeRoleController.delete = wrapAsync(async (req, res) => {
  const action = await employeeRoleService.delete(req.params.id)
  res.json(action)
})

module.exports = {
  employeeRoleController: employeeRoleController,
  findEmployeeRoleOr404: findObjectOr404('employeeRole', employeeRoleService)
}
