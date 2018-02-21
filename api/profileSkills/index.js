import { Router } from 'express'
import ProfileSkillService from '../../services/profileSkills'
import utils from '../utils'

const profileSkillService = new ProfileSkillService()
const router = Router()
router.param('id', utils.findObjectOr404('profileSkill', profileSkillService))

export default () => {
  router.get('/', (req, res) => {
    profileSkillService.getAll()
      .then(profileSkills => {
        res.json(profileSkills)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  })

  router.get('/:id', (req, res) => {
    const profileSkill = req.profileSkill
    res.json(profileSkill)
  })

  return router
}
