import { Router } from 'express'
import { projectController, findProjectOr404 } from '../../controllers/projects'
import profiles from './profiles'

const router = Router()

export default () => {
  router.param('id', findProjectOr404)

  /**
  * @swagger
  * /projects:
  *   get:
  *     description: A list of projects
  *     tags:
  *       - projects
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: An array of JSON objects containing projects
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: "#/components/schemas/project"
  *       401:
  *         description: Unauthorized
  */
  router.get('/', projectController.getAll)

  /**
  * @swagger
  * /projects:
  *   post:
  *     description: Create a project
  *     tags:
  *       - projects
  *     produces:
  *       - application/json
  *     responses:
  *       201:
  *         description: A JSON object containing the new projects
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/project"
  *       401:
  *         description: Unauthorized
  *     requestBody:
  *       content:
  *         application/json:
  *           schema:
  *             $ref: "#/components/schemas/project"
  */
  router.post('/', projectController.create)

  /**
  * @swagger
  * /projects/{id}:
  *   get:
  *     description: Returns a project
  *     tags:
  *       - projects
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing a project
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/project"
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
  router.get('/:id', projectController.get)

  /**
  * @swagger
  * /projects/{id}:
  *   put:
  *     description: Update a project
  *     tags:
  *       - projects
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing the updated project
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/project"
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
  *             $ref: "#/components/schemas/project"
  */
  router.put('/:id', projectController.update)

  /**
  * @swagger
  * /projects/{id}:
  *   delete:
  *     description: Delete a project
  *     tags:
  *       - projects
  *     produces:
  *       - application/json
  *     responses:
  *       404:
  *         description: Not found
  *     parameters:
  *       - name: id
  *         in: path
  *         schema:
  *           type: integer
  *           format: int64
  */
  router.delete('/:id', projectController.delete)

  router.use('/:id/profiles', profiles())

  return router
}
