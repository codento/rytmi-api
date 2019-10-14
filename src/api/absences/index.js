import { Router } from 'express'
import { absenceController } from '../../controllers/absences'

const router = Router()

export default () => {
  /**
  * @swagger
  * /absences:
  *   get:
  *     description: A list of all absences
  *     tags:
  *       - absences
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: An array of JSON objects containing absences
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: "#/components/schemas/absence"
  *       401:
  *         description: Unauthorized
  */
  router.get('/', absenceController.getAll)

  return router
}
