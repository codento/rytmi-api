import { Router } from 'express'
import { profileProjectController, findProfileProjectOr404 } from '../../controllers/profileProjects'

const router = Router()

export default () => {
  router.param('id', findProfileProjectOr404)

  /**
  * @swagger
  * /profileprojects:
  *   get:
  *     description: Returns a list of profile projects
  *     tags:
  *       - profileprojects
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: An array of JSON objects containing profile projects
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: "#/components/schemas/ProfileProject"
  *       401:
  *         description: Unauthorized
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/error"
  */
  router.get('/', profileProjectController.getList)

  /**
  * @swagger
  * /profileprojects/{id}:
  *   get:
  *     description: Returns a project
  *     tags:
  *       - profileprojects
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing a profile project
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/ProfileProject"
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
  router.get('/:id', profileProjectController.get)

  /**
  * @swagger
  * /profileprojects/{id}:
  *   put:
  *     description: Update project
  *     tags:
  *       - profileprojects
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing the updated profile project
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/ProfileProject"
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
  *             $ref: "#/components/schemas/ProfileProject"
  */
  router.put('/:id', profileProjectController.update)

  /**
  * @swagger
  * /profileprojects/{id}:
  *   delete:
  *     description: A project
  *     tags:
  *       - profileprojects
  *     produces:
  *       - application/json
  *     responses:
  *       204:
  *         description: Success/No content
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
  router.delete('/:id', profileProjectController.delete)

  return router
}
