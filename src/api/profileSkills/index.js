import { Router } from 'express'
import {profileSkillController, findProfileSkillOr404} from '../../controllers/profileSkills'

const router = Router()

router.param('id', findProfileSkillOr404)

export default () => {
  router.get('/', profileSkillController.getAll)
  router.get('/:id', profileSkillController.get)

  return router
}
