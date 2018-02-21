import SkillService from '../../services/skills'
import { Router } from 'express'
import utils from '../utils'

const skillService = new SkillService()
const router = Router()
router.param('id', utils.findObjectOr404('skill', skillService))

export default () => {
  router.get('/', (req, res) => {
    skillService.getAll()
      .then(skills => {
        res.json(skills)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  })

  router.get('/:id', (req, res) => {
    const skill = req.skill
    res.status(200).json(skill)
  })

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
