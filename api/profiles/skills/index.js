import { Router } from 'express'
import profileSkillService from '../../../services/profileSkills'
import utils from '../../utils'

const router = Router()
router.param('profileSkillId', (req, res, next, value) => {
    const profile = req.profile
    profileSkillService.getByIds(profile.id, value)
      .then(profileSkill => {
        if (profileSkill) {
          req.profileSkill = profileSkill
          next()
        } else {
          res.status(404).send('profileSkill not found')
        }
      })
      .catch(err => {
        res.status(500).send(err)
      })
  }) 
  
export default () => {
  router.get('/', (req, res) => {
    const profile = req.profile
    profileSkillService.getByProfileId(profile.id)
      .then(profileSkills => {
        res.json(profileSkills)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  })

  router.post('/', (req, res) => {
    const profile = req.profile
    profileSkillService.create(profile.id, req.body)
      .then(profileSkill => {
        res.status(201).json(profileSkill)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  })

  router.get('/:profileSkillId', (req, res) => {
    const profileSkill = req.profileSkill
    res.json(profileSkill)
  })

  router.put('/:profileSkillId', (req, res) => {
    profileSkillService.update(req.params.id, req.params.profileSkillId, req.body)
      .then(profileSkill => {
        res.json(profileSkill)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  })

  router.delete('/:profileSkillId', (req, res) => {
    profileSkillService.delete(req.params.id, req.params.profileSkillId)
      .then(profileSkill => {
        res.status(204).json(profileSkill)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  })

  return router
}