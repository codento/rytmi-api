import { Router } from 'express'
import skills from './skills'
import projects from './projects'
import { profileController, findProfileOr404 } from '../../controllers/profiles'
import { createPermissionHandler } from '../utils'

const router = Router()
const permissionHandler = createPermissionHandler('profile', 'userId')

export default () => {
  router.param('id', findProfileOr404)

  /**
  * @swagger
  * /profiles:
  *   get:
  *     description: Retrieve a list of employees
  *     tags:
  *       - employee
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: An array of JSON objects containing employee profiles
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: "#/components/schemas/profile"
  *       401:
  *         description: Unauthorized
  */
  router.get('/', profileController.getList)

  /**
  * @swagger
  * /profiles:
  *   post:
  *     description: Create an employee
  *     tags:
  *       - employee
  *     produces:
  *       - application/json
  *     responses:
  *       201:
  *         description: A JSON object containing the created employee profile
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/profile"
  *       401:
  *         description: Unauthorized
  *     requestBody:
  *       content:
  *         application/json:
  *           schema:
  *             $ref: "#/components/schemas/profile"
  */
  router.post('/', profileController.create)

  /**
  * @swagger
  * /profiles/{id}/:
  *   get:
  *     description: Retrieve a single employee profile
  *     tags:
  *       - employee
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing an employee profile
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/profile"
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
  *     description: Update employee profile
  *     tags:
  *       - employee
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing the updated employee profile
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/profile"
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
  *             $ref: "#/components/schemas/profile"
  */
  router.put('/:id', permissionHandler, profileController.update)

  router.use('/:id/projects', projects())
  router.use('/:id/skills', skills())

  return router
}
