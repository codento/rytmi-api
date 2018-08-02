import { Router } from 'express'
import { profileProjectController, findProjectFromProfileOr404 } from '../../../controllers/profileProjects'
import { findProjectOr404 } from '../../../controllers/projects'

const router = Router()

export default () => {
  router.param('projectId', findProjectFromProfileOr404)
  router.param('anyProjectId', findProjectOr404)

  router.get('/', profileProjectController.getByProfile)

  router.get('/:projectId', profileProjectController.get)
  router.post('/:anyProjectId', profileProjectController.create)

  return router
}
