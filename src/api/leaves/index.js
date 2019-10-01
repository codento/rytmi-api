import { Router } from 'express'
import {leaveController, findLeaveOr404} from '../../controllers/leaves'

const router = Router()

export default () => {
  router.param('id', findLeaveOr404)

  /**
  * @swagger
  * /leaves:
  *   get:
  *     description: A list of all leaves and absences
  *     tags:
  *       - leaves
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: An array of JSON objects containing leaves
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: "#/components/schemas/leave"
  *       401:
  *         description: Unauthorized
  */
  router.get('/', leaveController.getAll)

  /**
  * @swagger
  * /leaves:
  *   post:
  *     description: Add a leave
  *     tags:
  *       - leaves
  *     produces:
  *       - application/json
  *     responses:
  *       201:
  *         description: A JSON object containing a new leave
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/leave"
  *       401:
  *         description: Unauthorized
  *     requestBody:
  *       content:
  *         application/json:
  *           schema:
  *             $ref: "#/components/schemas/leave"
  */
  router.post('/', leaveController.create)

  /**
  * @swagger
  * /leaves/{id}:
  *   put:
  *     description: Update a leave
  *     tags:
  *       - leaves
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing the updated leave
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/leave"
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
  *             $ref: "#/components/schemas/leave"
  */
  router.put('/:id', leaveController.update)

  /**
   * @swagger
   * /leaves/{id}/:
   *   get:
   *     description: Retrieve a single leave
   *     tags:
   *       - leaves
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A JSON object containing a leave
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/leave"
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
  router.get('/:id', leaveController.get)

  /**
   * @swagger
   * /leaves/{id}:
   *   delete:
   *     description: Delete a leave
   *     tags:
   *       - leaves
   *     produces:
   *       - application/json
   *     responses:
   *       204:
   *         description: The leave was deleted successfully.
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
  router.delete('/:id', leaveController.delete)

  return router
}
