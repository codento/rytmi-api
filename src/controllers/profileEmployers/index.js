import ProfileEmployerService from '../../services/profileEmployers'
import baseController from '../index'
import { findObjectOr404, wrapAsync } from '../utils'

const profileEmployerService = new ProfileEmployerService()

let profileEmployerController = baseController('profileEmployer', profileEmployerService)

profileEmployerController.update = wrapAsync(async (req, res) => {
  const obj = await profileEmployerService.update(req['profileEmployer'].id, req.body)
  res.json(obj)
})

profileEmployerController.delete = wrapAsync(async (req, res) => {
  const action = await profileEmployerService.delete(req.params.id)
  res.json(action)
})

module.exports = {
  profileEmployerController: profileEmployerController,
  findProfileEmployerOr404: findObjectOr404('profileEmployer', profileEmployerService)
}
