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

  router.post('/', wrapAsync(async (req, res) => {
    const skill = await skillService.create(req.body)
    res.status(201).json(skill)
  }))

  router.put('/:id', wrapAsync(async (req, res) => {
    const skill = await skillService.update(req.params.id, req.body)
    res.json(skill)
  }))

  return router
}
