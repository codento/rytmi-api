import { Router } from 'express'
import { projectSkillController, findProjectSkillOr404 } from '../../controllers/projectSkills'

const router = Router()

export default () => {
  router.param('id', findProjectSkillOr404)

  /**
  * @swagger
  * /projectskills:
  *   get:
  *     description: Retrieve a list of all relations between projects and skills
  *     tags:
  *       - project
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A array of JSON objects containing relations between projects and skills
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: "#/components/schemas/projectSkill"
  *       401:
  *         description: Unauthorized
  */
  router.get('/', projectSkillController.getAll)

  /**
  * @swagger
  * /projectskills:
  *   post:
  *     description: Add a relation between project and skill
  *     tags:
  *       - project
  *     produces:
  *       - application/json
  *     responses:
  *       201:
  *         description: A JSON object containing a new relation between project and skill
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/projectSkill"
  *       401:
  *         description: Unauthorized
  *     requestBody:
  *       content:
  *         application/json:
  *           schema:
  *             $ref: "#/components/schemas/projectSkill"
  */
  router.post('/', projectSkillController.create)

  /**
  * @swagger
  * /projectskills/{id}:
  *   get:
  *     description: Retrieve a single relation between project and skill
  *     tags:
  *       - project
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing a relation between project and skill
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/projectSkill"
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
  router.get('/:id', projectSkillController.get)

  /**
  * @swagger
  * /projectskills/{id}:
  *   put:
  *     description: Update a relation between project and skill
  *     tags:
  *       - project
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing the updated relation between project and skill
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/projectSkill"
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
  *             $ref: "#/components/schemas/projectSkill"
  */
  router.put('/:id', projectSkillController.update)

  /**
   * @swagger
   * /projectskills/{id}:
   *   delete:
   *     description: Delete a relation between project and skill
   *     tags:
   *       - project
   *     produces:
   *       - application/json
   *     responses:
   *       204:
   *         description: The relation between project and skill was deleted successfully
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
  router.delete('/:id', projectSkillController.delete)

  return router
}
