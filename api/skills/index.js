import SkillService from '../../services/skills'
import { Router } from 'express'
import {findObjectOr404, wrapAsync} from '../utils'

const skillService = new SkillService()
const router = Router()
router.param('id', findObjectOr404('skill', skillService))

export default () => {
  router.get('/', wrapAsync(async (req, res) => {
    const skills = await skillService.getAll()
    res.json(skills)
  }))

  router.get('/:id', wrapAsync(async (req, res) => {
    const skill = req.skill
    res.status(200).json(skill)
  }))

  router.post('/', (req, res) => {
    skillService.create(req.body)
      .then(skill => {
        res.status(201).json(skill)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  })

  router.put('/:id', (req, res) => {
    skillService.update(req.params.id, req.body)
      .then(skill => {
        res.json(skill)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  })

  return router
}
