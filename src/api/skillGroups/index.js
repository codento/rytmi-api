import { Router } from 'express'
import { skillGroupController, findSkillGroupOr404 } from '../../controllers/skillGroups/index'

const router = Router()

export default () => {
  router.param('id', findSkillGroupOr404)

  /**
   * @swagger
   * /skillgroups:
   *   get:
   *     description: Retrieve a list of skill groups
   *     tags:
   *       - skills
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: An array of JSON objects containing skill groups
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: "#/components/schemas/skillGroup"
   *       401:
   *         description: Unauthorized
   */
  router.get('/', skillGroupController.getAll)

  /**
   * @swagger
   * /skillgroups/:
   *   post:
   *     description: Create a skill group
   *     tags:
   *       - skills
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: A JSON object containing a new skill group
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/skillGroup"
   *       401:
   *         description: Unauthorized
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/skillGroup"
   */
  router.post('/', skillGroupController.create)

  /**
   * @swagger
   * /skillgroups/{id}:
   *   get:
   *     description: Retrieve a single skill group
   *     tags:
   *       - skills
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A JSON object containing a skill group
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/skillGroup"
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
  router.get('/:id', skillGroupController.get)

  /**
   * @swagger
   * /skillgroups/{id}:
   *   put:
   *     description: Update a skill group
   *     tags:
   *       - skills
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A JSON object containing the updated skillgroup
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/skillGroup"
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
   *             $ref: "#/components/schemas/skillGroup"
   */
  router.put('/:id', skillGroupController.update)

  /**
   * @swagger
   * /skillgroups/{id}:
   *   delete:
   *     description: Not implemented
   *     tags:
   *       - skills
   *     produces:
   *       - applicatios/json
   *     responses:
   *       204:
   *         description: The skill group was deleted successfully
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
  router.delete('/:id', skillGroupController.delete)

  return router
}
