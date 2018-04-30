import { Router } from 'express'
import { profileProjectController } from '../../../controllers/profileProjects'
import { findObjectOr404 as findProfileOr404 } from '../../../controllers/profiles'

const router = Router()

export default () => {
  router.param('profileId', findProfileOr404)

  router.get('/', profileProjectController.getAllInProject)
  router.post('/:profileId', profileProjectController.create)

  return router
}
