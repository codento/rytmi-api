import { Router } from 'express'
import {skillController, findSkillOr404} from '../../controllers/skills'

const router = Router()

export default () => {
  router.param('id', findSkillOr404)

  /**
  * @swagger
  * /skills:
  *   get:
  *     description: Retrieve a list of all skills
  *     tags:
  *       - skills
  *     produces:
  *       - applicatio/json
  *     responses:
  *       200:
  *         description: An array of JSON objects containing skills
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: "#/components/schemas/skill"
  *       401:
  *         description: Unauthorized
  */
  router.get('/', skillController.getAll)

  /**
  * @swagger
  * /skills:
  *   post:
  *     description: Add a skill
  *     tags:
  *       - skills
  *     produces:
  *       - applicatio/json
  *     responses:
  *       201:
  *         description: A JSON object containing a new skill
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/skill"
  *       401:
  *         description: Unauthorized
  *     requestBody:
  *       content:
  *         application/json:
  *           schema:
  *             $ref: "#/components/schemas/skill"
  */
  router.post('/', skillController.create)

  /**
  * @swagger
  * /skills/{id}:
  *   get:
  *     description: Retrieve a single skill
  *     tags:
  *       - skills
  *     produces:
  *       - applicatio/json
  *     responses:
  *       200:
  *         description: A JSON object containing a skill
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/skill"
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
  router.get('/:id', skillController.get)

  /**
  * @swagger
  * /skills/{id}:
  *   put:
  *     description: Update a skill
  *     tags:
  *       - skills
  *     produces:
  *       - applicatio/json
  *     responses:
  *       200:
  *         description: A JSON object containing the updated skill
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/skill"
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
  *     requestBody:
  *       content:
  *         application/json:
  *           schema:
  *             $ref: "#/components/schemas/skill"
  */
  router.put('/:id', skillController.update)

  router.delete('/:id', skillController.delete)

  return router
}
