import { Router } from 'express'
import { profileProjectController, findObjectOr404 } from '../../controllers/profileProjects'

const router = Router()

export default () => {
  router.get('/', profileProjectController.getAll)

  return router
}
