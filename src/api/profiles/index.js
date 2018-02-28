import { Router } from 'express'
import skills from './skills'
import {profileController, findObjectOr404} from '../../controllers/profiles'

const router = Router()

router.param('id', findObjectOr404)

export default () => {
  router.get('/', profileController.getActive)
  router.post('/', profileController.create)
  router.get('/all', profileController.getAll)

  router.get('/:id', profileController.get)
  router.put('/:id', profileController.update)

  router.use('/:id/skills', skills())

  return router
}
