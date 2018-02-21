import { Router } from 'express'
import ProfileService from '../../services/profiles'
import {findObjectOr404, wrapAsync} from '../utils'
import skills from './skills'

const profileService = new ProfileService()
const router = Router()

router.param('id', findObjectOr404('profile', profileService))

export default () => {
  router.get('/', wrapAsync(async (req, res) => {
    const profiles = await profileService.getActive()
    res.json(profiles)
  }))

  router.post('/', wrapAsync(async (req, res) => {
    const profile = await profileService.create(req.body)
    res.status(201).json(profile)
  }))

  router.get('/all', wrapAsync(async (req, res) => {
    const profiles = await profileService.getAll()
    res.json(profiles)
  }))

  router.get('/:id', wrapAsync(async (req, res) => {
    const profile = req.profile
    res.json(profile)
  }))

  router.put('/:id', wrapAsync(async (req, res) => {
    const profile = await profileService.update(req.params.id, req.body)
    res.json(profile)
  }))

  router.use('/:id/skills', skills())

  return router
}
