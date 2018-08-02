import { Router } from 'express'
import { projectController, findProjectOr404 } from '../../controllers/projects'
import profiles from './profiles'

const router = Router()

export default () => {
  router.param('id', findProjectOr404)

  router.get('/', projectController.getAll)
  router.post('/', projectController.create)

  router.get('/:id', projectController.get)
  router.put('/:id', projectController.update)
  router.delete('/:id', projectController.delete)

  router.use('/:id/profiles', profiles())

  return router
}
