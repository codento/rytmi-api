import { Router } from 'express'
import { profileProjectController, findObjectOr404 } from '../../controllers/profileProjects'

const router = Router()

export default () => {
  router.param('id', findObjectOr404)

  router.get('/', profileProjectController.getAll)

  router.get('/:id', profileProjectController.get)
  router.put('/:id', profileProjectController.update)
  router.delete('/:id', profileProjectController.delete)

  return router
}
