import UserService from '../../services/users'
import { Router } from 'express'
import {findObjectOr404, wrapAsync} from '../utils'

const userService = new UserService()
const router = Router()
router.param('id', findObjectOr404('user', userService))

export default () => {
  router.get('/', wrapAsync(async (req, res) => {
    const users = await userService.getAll()
    res.json(users)
  }))

  router.post('/', wrapAsync(async (req, res) => {
    const user = await userService.create(req.body)
    res.status(201).json(user)
  }))

  router.get('/:id', wrapAsync(async (req, res) => {
    const user = req.user
    res.json(user)
  }))

  router.put('/:id', wrapAsync(async (req, res) => {
    const user = await userService.update(req.params.id, req.body)
    res.json(user)
  }))

  return router
}
