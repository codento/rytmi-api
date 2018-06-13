import { Router } from 'express'
import {skillController, findSkillOr404} from '../../controllers/skills'

const router = Router()

export default () => {
  router.param('id', findSkillOr404)

  router.get('/', skillController.getAll)
  router.post('/', skillController.create)

  router.get('/:id', skillController.get)
  router.put('/:id', skillController.update)

  return router
}
