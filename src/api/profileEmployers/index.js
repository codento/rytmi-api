import { Router } from 'express'
import { profileEmployerController, findProfileEmployerOr404 } from '../../controllers/profileEmployers'

const router = Router()

export default () => {
  router.param('id', findProfileEmployerOr404)

  /**
  * @swagger
  * /profileemployers:
  *   get:
  *     description: Retrieve a list of all relations between employee profiles and employers
  *     tags:
  *       - employee
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: An array of JSON objects, each object containing relation between employee profile with employer
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: "#/components/schemas/profileEmployers"
  *       401:
  *         description: Unauthorized
  */
  router.get('/', profileEmployerController.getAll)

  /**
  * @swagger
  * /profileemployers:
  *   post:
  *     description: Add a relation between employee profile and employer
  *     tags:
  *       - employee
  *     produces:
  *       - application/json
  *     responses:
  *       201:
  *         description: A JSON object containing a new relation between employee profile and employer
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/profileEmployers"
  *       401:
  *         description: Unauthorized
  *     requestBody:
  *       content:
  *         application/json:
  *           schema:
  *             $ref: "#/components/schemas/profileEmployers"
  */
  router.post('/', profileEmployerController.create)

  /**
  * @swagger
  * /profileemployers/{id}:
  *   get:
  *     description: Retrieve a single relation between employee profile and employer
  *     tags:
  *       - employee
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing a relation between employee profile and employer
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/profileEmployers"
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
  router.get('/:id', profileEmployerController.get)

  /**
  * @swagger
  * /profileemployers/{id}:
  *   put:
  *     description: Update a relation between an employee profile and employer
  *     tags:
  *       - employee
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing the updated relation between employee profile and employer
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/profileEmployers"
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
  *             $ref: "#/components/schemas/profileEmployers"
  */
  router.put('/:id', profileEmployerController.update)

  /**
   * @swagger
   * /profileemployers/{id}:
   *   delete:
   *     description: Delete a relation between employee profile and employer
   *     tags:
   *       - employee
   *     produces:
   *       - application/json
   *     responses:
   *       204:
   *         description: The relation between employee profile and employer was deleted successfully.
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
  router.delete('/:id', profileEmployerController.delete)

  return router
}
