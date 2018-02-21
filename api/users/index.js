import UserService from '../../services/users'
import { Router } from 'express'
import utils from '../utils'

const userService = new UserService()
const router = Router()
router.param('id', utils.findObjectOr404('user', userService))

export default () => {
  router.get('/', (req, res) => {
    userService.getAll()
      .then(users => {
        res.json(users)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  })

  router.post('/', (req, res) => {
    userService.create(req.body)
      .then(user => {
        res.status(201).json(user)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  })

  router.get('/:id', (req, res) => {
    const user = req.user
    res.json(user)
  })

  router.put('/:id', (req, res) => {
    userService.update(req.params.id, req.body)
      .then(user => {
        res.json(user)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  })

  return router
}
