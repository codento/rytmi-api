import { Router } from 'express'
import {profileSkillController, findProfileSkillOr404} from '../../controllers/profileSkills'

const router = Router()

router.param('id', findProfileSkillOr404)

export default () => {
  /**
  * @swagger
  * /profileskills:
  *   get:
  *     description: Retrieve a list of relations between employee profiles and skills
  *     tags:
  *       - employee
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: An array of JSON objects containing relations between employee profiles and skills
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: "#/components/schemas/profileSkill"
  *       401:
  *         description: Unauthorized
  */
  router.get('/', profileSkillController.getAll)

  /**
  * @swagger
  * /profileskills/{id}:
  *   get:
  *     description: Retrieve a relation between employee profile and skill
  *     tags:
  *       - employee
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing a relation between employee profile and skill
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/profileSkill"
  *       401:
  *         description: Unauthorized
  *       404:
  *         description: Not found
  *     parameters:
  *       - name: id
  *         in: path
  *         schema:
  *           type: integer
  *           format: int64
  */
  router.get('/:id', profileSkillController.get)

  return router
}
