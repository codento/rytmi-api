import { Router } from 'express'
import { profileProjectController, findObjectByProjectOr404 } from '../../../controllers/profileProjects'

const router = Router()

export default () => {
  router.param('ProfileId', findObjectByProjectOr404)

  router.get('/', profileProjectController.getAllInProject)
  router.post('/', profileProjectController.create)

  router.get('/:ProfileId', profileProjectController.get)
  router.put('/:ProfileId', profileProjectController.update)
  router.delete('/:ProfileId', profileProjectController.delete)

  return router
}
