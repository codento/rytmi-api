import { Router } from 'express'
import {profileSkillController, findObjectByProfileOr404} from '../../../controllers/profileSkills'

const router = Router()

export default () => {
  router.param('profileSkillId', findObjectByProfileOr404)

  router.get('/', profileSkillController.getByProfile)
  router.post('/', profileSkillController.create)

  router.get('/:profileSkillId', profileSkillController.get)
  router.put('/:profileSkillId', profileSkillController.update)
  router.delete('/:profileSkillId', profileSkillController.delete)

  return router
}
