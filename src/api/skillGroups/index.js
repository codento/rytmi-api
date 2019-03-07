import { Router } from 'express'
import { skillGroupController, findSkillGroupOr404 } from '../../controllers/skillGroups/index'

const router = Router()

export default () => {
  router.param('id', findSkillGroupOr404)

  /**
   * @swagger
   * /skillgroups:
   *   get:
   *     description: List of skillgroups
   *     tags:
   *       - skillgroups
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: "#/components/schemas/skillGroup"
   *         description: An array of JSON objects containing skillgroups
   *       401:
   *         description: Unauthorized
   */
  router.get('/', skillGroupController.getAll)

  /**
   * @swagger
   * /skillgroups/:
   *   post:
   *     description: Update skillgroup
   *     tags:
   *       - skillgroups
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: A JSON object containing the updated skillgroup
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
   *     description: Show a single skillgroup
   *     tags:
   *       - skillgroups
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A JSON object containing a skillgroup
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
   *     description: Update a skillgroup
   *     tags:
   *       - skillgroups
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
   *     description: Delete a skillgroup
   *     tags:
   *       - skillgroups
   *     produces:
   *       - applicatios/json
   *     responses:
   *       204:
   *         description: Skillgroup deleted
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
