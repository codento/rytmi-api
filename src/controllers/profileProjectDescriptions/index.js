import ProfileProjectDescriptionService from '../../services/profileProjectDescriptions'
import baseController from '../index'
import { findObjectOr404, wrapAsync } from '../utils'

const profileProjectDescriptionService = new ProfileProjectDescriptionService()

let profileProjectDescriptionController = baseController('profileProjectDescription', profileProjectDescriptionService)

profileProjectDescriptionController.update = wrapAsync(async (req, res) => {
  const obj = await profileProjectDescriptionService.update(req['profileProjectDescription'].id, req.body)
  res.json(obj)
})

profileProjectDescriptionController.delete = wrapAsync(async (req, res) => {
  const action = await profileProjectDescriptionService.delete(req.params.id)
  res.json(action)
})

module.exports = {
  profileProjectDescriptionController: profileProjectDescriptionController,
  findProfileProjectDescriptionOr404: findObjectOr404('profileProjectDescription', profileProjectDescriptionService)
}
