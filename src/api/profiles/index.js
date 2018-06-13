import { Router } from 'express'
import skills from './skills'
import projects from './projects'
import {profileController, findProfileOr404} from '../../controllers/profiles'

const router = Router()

export default () => {
  router.param('id', findProfileOr404)

  router.get('/', profileController.getList)
  router.post('/', profileController.create)
  router.get('/all', profileController.getAllDeprecated)

  router.get('/:id', profileController.get)
  router.put('/:id', profileController.update)

  router.use('/:id/projects', projects())
  router.use('/:id/skills', skills())

  return router
}
