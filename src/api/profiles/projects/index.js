import { Router } from 'express'
import { profileProjectController, findProjectFromProfileOr404 } from '../../../controllers/profileProjects'
import { findProjectOr404 } from '../../../controllers/projects'

const router = Router()

export default () => {
  router.param('projectId', findProjectFromProfileOr404)
  router.param('anyProjectId', findProjectOr404)

  /**
  * @swagger
  * /profiles/{id}/projects:
  *   get:
  *     description: Retrieve a list of projects for employee
  *     tags:
  *       - employee
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: An array of JSON objects containing projects related to an employee profile
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
  *         in: path
  *         schema:
  *           type: integer
  *           format: int64
  */
  router.get('/', profileProjectController.getByProfile)

  /**
  * @swagger
  * /profiles/{id}/projects/{projectId}:
  *   get:
  *     description: Retrieve a single project of an employee
  *     tags:
  *       - employee
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing a project related to an employee profile
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
  *         description: profile id
  *         in: path
  *         schema:
  *           type: integer
  *           format: int64
  *       - name: projectId
  *         in: path
  *         schema:
  *           type: integer
  *           format: int64
  */
  router.get('/:projectId', profileProjectController.getByIds)

  /**
  * @swagger
  * /profiles/{id}/projects/{anyProjectId}:
  *   post:
  *     description: Create a relation between employee profile and project
  *     tags:
  *       - employee
  *     produces:
  *       - application/json
  *     responses:
  *       201:
  *         description: A JSON object containing a relation between employee profile and project
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/profileProject"
  *       400:
  *         description: Bad request
  *       404:
  *         description: Not found
  *     parameters:
  *       - name: id
  *         description: Profile id
  *         in: path
  *         schema:
  *           type: integer
  *           format: int64
  *       - name: anyProjectId
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
  router.post('/:anyProjectId', profileProjectController.create)

  return router
}
