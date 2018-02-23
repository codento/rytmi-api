import { Router } from 'express'
import {profileSkillController, findObjectOr404} from '../../controllers/profileSkills'

const router = Router()

router.param('id', findObjectOr404)

export default () => {
  router.get('/', profileSkillController.getAll)
  router.get('/:id', profileSkillController.get)

  return router
}
