import { Router } from 'express'
import { projectSkillController, findProjectSkillOr404 } from '../../controllers/projectSkills'

const router = Router()

export default () => {
  router.param('id', findProjectSkillOr404)

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
  router.get('/', projectSkillController.getAll)

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
  router.post('/', projectSkillController.create)

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
  router.get('/:id', projectSkillController.get)

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
  router.put('/:id', projectSkillController.update)

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
  router.delete('/:id', projectSkillController.delete)

  return router
}
