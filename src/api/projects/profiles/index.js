import { Router } from 'express'
import { profileProjectController, findProfileFromProjectOr404 } from '../../../controllers/profileProjects'
import { findProfileOr404 } from '../../../controllers/profiles'

const router = Router()

export default () => {
  router.param('profileId', findProfileFromProjectOr404)
  router.param('anyProjectId', findProfileOr404)

  router.get('/', profileProjectController.getByProject)

  router.get('/:profileId', profileProjectController.get)
  router.post('/:anyProjectId', profileProjectController.create)

  return router
}
