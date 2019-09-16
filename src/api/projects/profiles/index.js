import { Router } from 'express'
import { profileProjectController, findProfileFromProjectOr404 } from '../../../controllers/profileProjects'
import { findProfileOr404 } from '../../../controllers/profiles'
import { createPermissionHandler } from '../../utils'

const router = Router()
const permissionHandler = createPermissionHandler('profile', 'userId')

export default () => {
  router.param('profileId', findProfileFromProjectOr404)
  router.param('anyProjectId', findProfileOr404)

  /**
  * @swagger
  * /projects/{id}/profiles:
  *   get:
  *     description: Retrieve a list of profiles related to the project
  *     tags:
  *       - project
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: An array of JSON objects containing profiles related to the project
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
  *     description: Retrieve the employee profile related to the project
  *     tags:
  *       - project
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing the employee profile related to the project
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
  router.get('/:profileId', profileProjectController.getByIds)

  /**
  * @swagger
  * /projects/{id}/profiles/{profileId}:
  *   post:
  *     description: Add the profile to the project
  *     tags:
  *       - project
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing the new relation between a project and a profile
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
