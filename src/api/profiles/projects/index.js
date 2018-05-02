import { Router } from 'express'
import { profileProjectController } from '../../../controllers/profileProjects'

const router = Router()

export default () => {
  router.get('/', profileProjectController.getProfilesProjects)

  return router
}
