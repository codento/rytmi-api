import { Router } from 'express'
import { profileProjectController, findProfileFromProjectOr404 } from '../../../controllers/profileProjects'
import { findProfileOr404 } from '../../../controllers/profiles'
import { createPermissionHandler } from '../../utils'

const router = Router()
const permissionHandler = createPermissionHandler('profile', 'id')

export default () => {
  router.param('profileId', findProfileFromProjectOr404)
  router.param('anyProjectId', findProfileOr404)

  /**
  * @swagger
  * /projects/{id}/profiles:
  *   get:
  *     description: A list of project profiles
  *     tags:
  *       - projects
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: An array of JSON objects containing project profiles
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: "#/components/schemas/profileProject"
  *       401:
  *         description: Unauthorized
  *       404:
  *         description: Not found
  *     parameters:
  *       - name: id
  *         description: Project id
  *         in: path
  *         schema:
  *           type: integer
  *           format: int64
  */
  router.get('/', profileProjectController.getByProject)

  /**
  * @swagger
  * /projects/{id}/profiles/{profileId}:
  *   get:
  *     description: A project profile
  *     tags:
  *       - projects
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing a project profile
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
  *         description: Project id
  *         in: path
  *         schema:
  *           type: integer
  *           format: int64
  *       - name: profileId
  *         in: path
  *         schema:
  *           type: integer
  *           format: int64
  */
  router.get('/:profileId', profileProjectController.get)

  /**
  * @swagger
  * /projects/{id}/profiles/{profileId}:
  *   post:
  *     description: Add profile to project
  *     tags:
  *       - projects
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing the new project profile
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/profileProject"
  *       404:
  *         description: Not found
  *     parameters:
  *       - name: id
  *         in: path
  *         schema:
  *           type: integer
  *           format: int64
  *       - name: profileId
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
  router.post('/:anyProjectId', permissionHandler, profileProjectController.create)

  return router
}
