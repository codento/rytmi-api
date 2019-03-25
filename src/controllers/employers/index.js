import EmployerService from '../../services/employers'
import baseController from '../index'
import { findObjectOr404, wrapAsync } from '../utils'

const employerService = new EmployerService()

let employerController = baseController('employer', employerService)

employerController.update = wrapAsync(async (req, res) => {
  const obj = await employerService.update(req['employer'].id, req.body)
  res.json(obj)
})

employerController.delete = wrapAsync(async (req, res) => {
  console.log(req)
  const action = await employerService.delete(req.params.id)
  res.json(action)
})

module.exports = {
  employerController: employerController,
  findEmployerOr404: findObjectOr404('employer', employerService)
}
