import { Router } from 'express'
import ProfileSkillService from '../../../services/profileSkills'
import {errorTemplate, wrapAsync} from '../../utils'

const profileSkillService = new ProfileSkillService()
const router = Router()
router.param('profileSkillId', (req, res, next, value) => {
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
})

export default () => {
  router.get('/', wrapAsync(async (req, res) => {
    const profile = req.profile
    const profileSkills = await profileSkillService.getByProfileId(profile.id)
    res.json(profileSkills)
  }))

  router.post('/', wrapAsync(async (req, res) => {
    const profile = req.profile
    const profileSkill = await profileSkillService.create(profile.id, req.body)
    res.status(201).json(profileSkill)
  }))

  router.get('/:profileSkillId', wrapAsync(async (req, res) => {
    const profileSkill = req.profileSkill
    res.json(profileSkill)
  }))

  router.put('/:profileSkillId', wrapAsync(async (req, res) => {
    const profile = req.profile
    const profileSkill = await profileSkillService.update(profile.id, req.params.profileSkillId, req.body)
    res.json(profileSkill)
  }))

  router.delete('/:profileSkillId', wrapAsync(async (req, res) => {
    const profile = req.profile
    const profileSkill = await profileSkillService.delete(profile.id, req.params.profileSkillId)
    res.status(204).json(profileSkill)
  }))

  return router
}
