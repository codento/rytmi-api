import { Router } from 'express'
import { profileProjectController, findObjectOr404 } from '../../controllers/profileProjects'

const router = Router()

router.param('projectId', findObjectOr404)
router.param('profileId', findObjectOr404)

export default () => {

  router.get('/', profileProjectController.getAll)

  return router
}
