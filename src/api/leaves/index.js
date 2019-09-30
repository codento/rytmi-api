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
  *         description: An array of JSON objects containing skills
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
  *         description: A JSON object containing a new skill
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

  router.get('/:id', leaveController.get)

  router.delete('/:id', leaveController.delete)

  return router
}
