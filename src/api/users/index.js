import { Router } from 'express'
import {userController, findUserOr404} from '../../controllers/users'

const router = Router()

export default () => {
  router.param('id', findUserOr404)

  router.get('/', userController.getAll)
  router.post('/', userController.create)

  router.get('/:id', userController.get)
  router.put('/:id', userController.update)

  return router
}
