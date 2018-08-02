import { Router } from 'express'
import { profileProjectController, findProfileProjectOr404 } from '../../controllers/profileProjects'

const router = Router()

export default () => {
  router.param('id', findProfileProjectOr404)

  router.get('/', profileProjectController.getList)

  router.get('/:id', profileProjectController.get)
  router.put('/:id', profileProjectController.update)
  router.delete('/:id', profileProjectController.delete)

  return router
}
