import { Router } from 'express'
import { profileProjectController, findObjectByProfileOr404} from '../../../controllers/profileProjects'

const router = Router()

export default () => {
  router.get('/', profileProjectController.getProfilesProjects)

  return router
}
