import { Router } from 'express'
import { profileProjectController, findObjectOr404 } from '../../controllers/profileProjects'

const router = Router()

router.param('projectId', findObjectOr404)
router.param('profileId', findObjectOr404)

export default () => {
  router.param('id', findObjectOr404)

  router.get('/', profileProjectController.getAll)

  router.get('/:id', profileProjectController.get)
  router.put('/:id', profileProjectController.update)
  router.delete('/:id', profileProjectController.delete)

  return router
}
