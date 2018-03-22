import { Router } from 'express'
import {projectController, findObjectOr404} from '../../controllers/projects'

const router = Router()

export default () => {
  router.param('id', findObjectOr404)

  router.get('/', projectController.getAll)

  return router
}
