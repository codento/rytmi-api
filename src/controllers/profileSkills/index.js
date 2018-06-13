import ProfileSkillService from '../../services/profileSkills'
import baseController from '../index'
import {findObjectOr404, wrapAsync} from '../utils'
import {errorTemplate} from '../../api/utils'

const profileSkillService = new ProfileSkillService()

let profileSkillController = baseController('profileSkill', profileSkillService)

profileSkillController.getByProfile = wrapAsync(async (req, res) => {
  const profile = req.profile
  const profileSkills = await profileSkillService.getByProfileId(profile.id)
  res.json(profileSkills)
})

profileSkillController.create = wrapAsync(async (req, res) => {
  const profile = req.profile
  const profileSkill = await profileSkillService.create(profile.id, req.body)
  res.status(201).json(profileSkill)
})

profileSkillController.update = wrapAsync(async (req, res) => {
  const profile = req.profile
  const profileSkill = await profileSkillService.update(profile.id, req.params.profileSkillId, req.body)
  res.json(profileSkill)
})

profileSkillController.delete = wrapAsync(async (req, res) => {
  const profile = req.profile
  const profileSkill = await profileSkillService.delete(profile.id, req.params.profileSkillId)
  res.status(204).json(profileSkill)
})

function findObjectByProfileOr404 (req, res, next, value) {
  const profile = req.profile
  profileSkillService.getByIds(profile.id, value)
    .then(profileSkill => {
      if (profileSkill) {
        req.profileSkill = profileSkill
        next()
      } else {
        res.status(404).json(errorTemplate(404, 'profileSkill not found'))
      }
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

module.exports = {
  profileSkillController: profileSkillController,
  findProfileSkillOr404: findObjectOr404('profileSkill', profileSkillService),
  findObjectByProfileOr404: findObjectByProfileOr404
}
