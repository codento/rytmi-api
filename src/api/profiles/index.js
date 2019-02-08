import { Router } from 'express'
import skills from './skills'
import projects from './projects'
import {profileController, findProfileOr404} from '../../controllers/profiles'
import { createPermissionHandler } from '../utils'

const router = Router()
const permissionHandler = createPermissionHandler('profile', 'id')

export default () => {
  router.param('id', findProfileOr404)

  /**
  * @swagger
  * /profiles:
  *   get:
  *     description: List of active profiles
  *     tags:
  *       - profiles
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: "#/components/schemas/Profile"
  *         description: An array of JSON objects containing profiles
  *       401:
  *         description: Unauthorized
  *       404:
  *         description: Not found
  */
  router.get('/', profileController.getList)

  /**
  * @swagger
  * /profiles:
  *   post:
  *     description: Create user
  *     tags:
  *       - profiles
  *     produces:
  *       - application/json
  *     responses:
  *       201:
  *         description: A JSON object containing the created profile
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/Profile"
  *       401:
  *         description: Unauthorized
  *     requestBody:
  *       content:
  *         application/json:
  *           schema:
  *             $ref: "#/components/schemas/Profile"
  */
  router.post('/', profileController.create)

  /**
  * @swagger
  * /profiles/all:
  *   get:
  *     description: List of all profiles, including inactive profiles
  *     tags:
  *       - profiles
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: "#/components/schemas/Profile"
  *         description: An array of JSON objects containing profiles
  *       401:
  *         description: Unauthorized
  */
  router.get('/all', profileController.getAllDeprecated)

  /**
  * @swagger
  * /profiles/{id}/:
  *   get:
  *     description: Show single profile
  *     tags:
  *       - profiles
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing a profile
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/Profile"
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
  router.get('/:id', profileController.get)

  /**
  * @swagger
  * /profiles/{id}/:
  *   put:
  *     description: Update profile
  *     tags:
  *       - profiles
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing the updated profile
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/Profile"
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
  *             $ref: "#/components/schemas/Profile"
  */
  router.put('/:id', permissionHandler, profileController.update)

  router.use('/:id/projects', projects())
  router.use('/:id/skills', skills())

  return router
}
