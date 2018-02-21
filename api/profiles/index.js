import { Router } from 'express'
import ProfileService from '../../services/profiles'
import utils from '../utils'
import skills from './skills'

const profileService = new ProfileService()
const router = Router()
router.param('id', utils.findObjectOr404('profile', profileService))

export default () => {
  router.get('/', (req, res) => {
    profileService.getActive()
      .then(profiles => {
        res.json(profiles)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  })

  router.post('/', (req, res) => {
    profileService.create(req.body)
      .then(profile => {
        res.status(201).json(profile)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  })

  router.get('/all', (req, res) => {
    profileService.getAll()
      .then(profiles => {
        res.json(profiles)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  })

  router.get('/:id', (req, res) => {
    const profile = req.profile
    res.json(profile)
  })

  router.put('/:id', (req, res) => {
    profileService.update(req.params.id, req.body)
      .then(profile => {
        res.json(profile)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  })

  router.use('/:id/skills', skills())

  return router
}
