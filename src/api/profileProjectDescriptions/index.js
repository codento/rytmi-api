import { Router } from 'express'
import { profileProjectDescriptionController, findProfileProjectDescriptionOr404 } from '../../controllers/profileProjectDescriptions'

const router = Router()

export default () => {
  router.param('id', findProfileProjectDescriptionOr404)

  // TODO: Update swagger
  /**
  * @swagger
  * /employers:
  *   get:
  *     description: A list of all employers
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
  router.get('/', profileProjectDescriptionController.getAll)

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
  router.post('/', profileProjectDescriptionController.create)

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
  router.get('/:id', profileProjectDescriptionController.get)

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
  router.put('/:id', profileProjectDescriptionController.update)

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
  router.delete('/:id', profileProjectDescriptionController.delete)

  return router
}
