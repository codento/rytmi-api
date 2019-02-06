import ProfileService from '../../services/profiles'
import baseController from '../index'
import { findObjectOr404, wrapAsync } from '../utils'
import { errorTemplate } from '../../api/utils'
import profileValidator from '../../validators/profile'
import PermissionDeniedError from '../../validators/permissionDeniedError'

const profileService = new ProfileService()

let profileController = baseController('profile', profileService, profileValidator)

profileController.getAllDeprecated = wrapAsync(async (req, res) => {
  const profiles = await profileService.getAll()
  res
    .status(299)
    .set({
      'Warning': '/profiles/all is deprecated. Use /profiles?active=* instead.'
    })
    .json(profiles)
})

profileController.getList = wrapAsync(async (req, res) => {
  const qs = req.query
  const criteria = {}
  if (!('active' in qs)) {
    res.redirect(301, '?active=true')
  } else {
    if (qs.active === 'false') {
      criteria.active = false
    } else if (qs.active === 'true') {
      criteria.active = true
    } else if (qs.active !== '*') {
      res.status(404).json(errorTemplate(400, 'active must be \'true\', \'false\' or \'*\''))
    }
  }

  const profiles = Object.keys(criteria).length >= 0 && criteria.constructor === Object
    ? await profileService.getFiltered(criteria)
    : await profileService.getAll()

  res.json(profiles)
})

profileController.update = wrapAsync(async (req, res) => {
  if (!req.user.admin && req.user.userId !== req.body.id) {
    throw new PermissionDeniedError('Permission denied')
  }
  profileValidator.validate(req.body)
  const obj = await profileService.update(req['profile'].id, req.body)
  res.json(obj)
})

module.exports = {
  profileController: profileController,
  findProfileOr404: findObjectOr404('profile', profileService)
}
