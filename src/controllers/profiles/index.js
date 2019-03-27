import ProfileService from '../../services/profiles'
import baseController from '../index'
import { findObjectOr404, wrapAsync } from '../utils'
import profileValidator from '../../validators/profile'

const profileService = new ProfileService()

let profileController = baseController('profile', profileService, profileValidator)

profileController.getList = wrapAsync(async (req, res) => {
  const query = req.query
  const criteria = {}
  if (query.active) {
    criteria.active = query.active
  }
  const profiles = await profileService.getFiltered(criteria)
  res.json(profiles)
})

profileController.update = wrapAsync(async (req, res) => {
  profileValidator.validate(req.body)
  const obj = await profileService.update(req['profile'].id, req.body)
  res.json(obj)
})

module.exports = {
  profileController: profileController,
  findProfileOr404: findObjectOr404('profile', profileService)
}
