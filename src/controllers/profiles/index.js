import ProfileService from '../../services/profiles'
import baseController from '../index'
import { findObjectOr404, wrapAsync } from '../utils'
import profileValidator from '../../validators/profile'

const profileService = new ProfileService()

let profileController = baseController('profile', profileService, profileValidator)

profileController.get = wrapAsync(async (req, res) => {
  const obj = await profileService.get(req.params.id)
  res.json(obj)
})

profileController.getList = wrapAsync(async (req, res) => {
  const query = req.query
  const criteria = {}
  if (query.active) {
    criteria.active = query.active
  }
  const profiles = await profileService.getFiltered(criteria)
  res.json(profiles)
})

module.exports = {
  profileController: profileController,
  findProfileOr404: findObjectOr404('profile', profileService)
}
