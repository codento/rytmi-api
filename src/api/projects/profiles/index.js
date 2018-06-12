import { Router } from 'express'
import { profileProjectController, findObjectByProjectOr404 } from '../../../controllers/profileProjects'
import { findObjectOr404 as findProfileOr404 } from '../../../controllers/profiles'

const router = Router()

export default () => {
  router.param('profileId', findObjectByProjectOr404)
  router.param('anyProjectId', findProfileOr404)

  router.get('/', profileProjectController.getByProject)
  
  router.get('/:profileId', profileProjectController.getByIds)
  router.post('/:anyProjectId', profileProjectController.create)

  return router
}
