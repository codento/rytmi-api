import { Router } from 'express'
import { userController, findUserOr404 } from '../../controllers/users'
import { createPermissionHandler } from '../utils'

const router = Router()
const adminOnly = true
const adminOnlyPermissionHandler = createPermissionHandler('userObj', 'id', adminOnly)

export default () => {
  router.param('id', findUserOr404)

  /**
  * @swagger
  * /users:
  *   get:
  *     description: Retrieve a list of users
  *     tags:
  *       - users
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: An array of JSON objects containing users
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: "#/components/schemas/User"
  *       401:
  *         description: Unauthorized
  */
  router.get('/', userController.getAll)

  /**
  * @swagger
  * /users:
  *   post:
  *     description: Add new user
  *     tags:
  *       - users
  *     produces:
  *       - application/json
  *     responses:
  *       201:
  *         description: A JSON object containing a new user
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/User"
  *       401:
  *         description: Unauthorized
  *     requestBody:
  *       content:
  *         application/json:
  *           schema:
  *             $ref: "#/components/schemas/User"
  */
  router.post('/', userController.create)

  /**
  * @swagger
  * /users/{id}:
  *   get:
  *     description: A JSON object containing a single user
  *     tags:
  *       - users
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A user
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: "#/components/schemas/User"
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
  router.get('/:id', userController.get)

  /**
  * @swagger
  * /users/{id}:
  *   put:
  *     description: Update a user
  *     tags:
  *       - users
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing the updated user
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/User"
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
  *             allOf:
  *               - $ref: "#/components/schemas/User"
  *                 required:
  *                   - name
  */
  router.put('/:id', userController.update)

  /**
  * @swagger
  * /users/{id}:
  *   put:
  *     description: Delete a user
  *     tags:
  *       - users
  *     produces:
  *       - application/json
  *     responses:
  *       204:
  *         description: No content
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/User"
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
  router.delete('/:id', adminOnlyPermissionHandler, userController.delete)

  return router
}
