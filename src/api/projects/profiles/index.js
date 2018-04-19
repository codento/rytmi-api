import { Router } from 'express'
import { profileProjectController, findObjectByProjectOr404 } from '../../../controllers/profileProjects'

const router = Router()

export default () => {
  router.param('profileId', findObjectByProjectOr404)

  router.get('/', profileProjectController.getAllInProject)
  router.post('/', profileProjectController.create)

  router.get('/:profileId', profileProjectController.get)
  router.put('/:profileId', profileProjectController.update)
  router.delete('/:profileId', profileProjectController.delete)

  return router
}
