import ProfileService from '../../services/profiles'
import baseController from '../index'
import {findObjectOr404, wrapAsync} from '../utils'

const profileService = new ProfileService()

let profileController = baseController('profile', profileService)

profileController.getActive = wrapAsync(async (req, res) => {
  const profiles = await profileService.getActive()
  res.json(profiles)
})

module.exports = {
  profileController: profileController,
  findObjectOr404: findObjectOr404('profile', profileService)
}
