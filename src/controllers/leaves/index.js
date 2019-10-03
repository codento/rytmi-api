import LeaveService from '../../services/leaves'
import baseController from '../index'
import {findObjectOr404, wrapAsync} from '../utils'

const leaveService = new LeaveService()

const leaveController = baseController('leave', leaveService)

leaveController.delete = wrapAsync(async (req, res) => {
  await leaveService.delete(req.params.id)
  res.status(204).send()
})

leaveController.create = wrapAsync(async (req, res, next) => {
  const newLeave = req.body
  try {
    const result = await leaveService.create(newLeave)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = {
  leaveController: leaveController,
  findLeaveOr404: findObjectOr404('leave', leaveService)
}
