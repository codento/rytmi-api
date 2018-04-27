import { Router } from 'express'
import { profileProjectController } from '../../../controllers/profileProjects'

const router = Router()

export default () => {

  router.get('/', profileProjectController.getAllInProject)
  router.post('/', profileProjectController.create)

  return router
}
