import { Router } from 'express'
import { profileProjectController, findObjectByProfileOr404 } from '../../../controllers/profileProjects'
import { findObjectOr404 as findProjectOr404 } from '../../../controllers/projects'

const router = Router()

export default () => {
  router.param('projectId', findObjectByProfileOr404)
  router.param('anyProjectId', findProjectOr404)

  router.get('/', profileProjectController.getByProfile)

  router.get('/:projectId', profileProjectController.getByIds)
  router.post('/:anyProjectId', profileProjectController.create)

  return router
}
