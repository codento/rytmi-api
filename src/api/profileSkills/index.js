import { Router } from 'express'
import {profileSkillController, findProfileSkillOr404} from '../../controllers/profileSkills'

const router = Router()

router.param('id', findProfileSkillOr404)

export default () => {
  /**
  * @swagger
  * /profileskills:
  *   get:
  *     description: A list of profileskills
  *     tags:
  *       - profileskills
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: An array of JSON objects containing profile skills
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: "#/components/schemas/ProfileSkill"
  *       401:
  *         description: Unauthorized
  */
  router.get('/', profileSkillController.getAll)

  /**
  * @swagger
  * /profileskills/{id}:
  *   get:
  *     description: A profileskill
  *     tags:
  *       - profileskills
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing a profile skill
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/ProfileSkill"
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
