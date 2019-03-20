import { Router } from 'express'
import { employeeRoleController, findEmployeeRoleOr404 } from '../../controllers/employeeRoles'

const router = Router()

export default () => {
  router.param('id', findEmployeeRoleOr404)

  /**
  * @swagger
  * /employeeroles:
  *   get:
  *     description: A list of all employeeRoles
  *     tags:
  *       - employee roles
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: An array of JSON objects containing employeeRoles
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: "#/components/schemas/employeeRole"
  *       401:
  *         description: Unauthorized
  */
  router.get('/', employeeRoleController.getAll)

  /**
  * @swagger
  * /employeeroles:
  *   post:
  *     description: Add a employeeRole
  *     tags:
  *       - employee roles
  *     produces:
  *       - application/json
  *     responses:
  *       201:
  *         description: A JSON object containing a new employeeRole
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/employeeRole"
  *       401:
  *         description: Unauthorized
  *     requestBody:
  *       content:
  *         application/json:
  *           schema:
  *             $ref: "#/components/schemas/employeeRole"
  */
  router.post('/', employeeRoleController.create)

  /**
  * @swagger
  * /employeeroles/{id}:
  *   get:
  *     description: Show a single employee role
  *     tags:
  *       - employee roles
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing a employeeRole
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/employeeRole"
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
  router.get('/:id', employeeRoleController.get)

  /**
  * @swagger
  * /employeeroles/{id}:
  *   put:
  *     description: Update a employeeRole
  *     tags:
  *       - employee roles
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing the updated employeeRole
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/employeeRole"
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
  *             $ref: "#/components/schemas/employeeRole"
  */
  router.put('/:id', employeeRoleController.update)

  /**
   * @swagger
   * /employeeroles/{id}:
   *   delete:
   *     description: Delete a employeeRole
   *     tags:
   *       - employee roles
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A JSON object containing the updated employeeRole
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/employeeRole"
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
   *             $ref: "#/components/schemas/employeeRole"
   */
  router.delete('/:id', employeeRoleController.delete)

  return router
}
