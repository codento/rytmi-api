import { Router } from 'express'
import { profileProjectController, findProfileProjectOr404 } from '../../controllers/profileProjects'
import { createPermissionHandler } from '../utils'

const router = Router()
const permissionHandler = createPermissionHandler('profileProject', 'profileId')

export default () => {
  router.param('id', findProfileProjectOr404)
  /**
  * @swagger
  * /profileprojects:
  *   get:
  *     description: Retrieve a list of relations between employee profiles and projects
  *     tags:
  *       - employee
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: An array of JSON objects containing the relation between employee profiles and projects
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: "#/components/schemas/profileProject"
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
  *     description: Returns the relation between a project and an employee profile
  *     tags:
  *       - employee
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing the relation between a project and an employee profile
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/profileProject"
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
  *     description: Update the relation between a project and an employee profile
  *     tags:
  *       - employee
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing the updated relation between a project and an employee profile.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/profileProject"
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
  *             $ref: "#/components/schemas/profileProject"
  */
  router.put('/:id', permissionHandler, profileProjectController.update)

  /**
  * @swagger
  * /profileprojects/{id}:
  *   delete:
  *     description: Delete a relation between a project and an employee profile.
  *     tags:
  *       - employee
  *     produces:
  *       - application/json
  *     responses:
  *       204:
  *         description: The relation between a project and an employee profile was deleted successfully.
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
  router.delete('/:id', permissionHandler, profileProjectController.delete)

  return router
}
