import { Router } from 'express'
import { absenceController, findAbsenceOr404 } from '../../../controllers/absences'
import { createPermissionHandler } from '../../utils'

const router = Router()
const permissionHandler = createPermissionHandler('profile', 'userId')

export default () => {
  router.param('absenceId', findAbsenceOr404)
  router.use(permissionHandler)

  /**
  * @swagger
  * /profiles/{id}/absences:
  *   get:
  *     description: A list of profile absences
  *     tags:
  *       - profiles
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: An array of JSON objects containing absences for profile
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: "#/components/schemas/absence"
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
  router.get('/', absenceController.getByProfile)

  /**
  * @swagger
  * /profiles/{id}/absences:
  *   post:
  *     description: Post new absence
  *     tags:
  *       - profiles
  *     produces:
  *       - application/json
  *     responses:
  *       204:
  *         description: A JSON object containing the new profile absences
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/absence"
  *       401:
  *         description: Unauthorized
  *       404:
  *         description: Not found
  *     parameters:
  *       - name: id
  *         description: Profile id
  *         in: path
  *         schema:
  *           type: integer
  *           format: int64
  *     requestBody:
  *       content:
  *         application/json:
  *           schema:
  *             $ref: "#/components/schemas/absence"
  */
  router.post('/', absenceController.create)

  /**
  * @swagger
  * /profiles/{id}/absence/{absenceId}:
  *   get:
  *     description: Retrieve an absence of profile
  *     tags:
  *       - profiles
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing an absence
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/absence"
  *       401:
  *         description: Unauthorized
  *       404:
  *         description: Not found
  *     parameters:
  *       - name: id
  *         description: Profile id
  *         in: path
  *         schema:
  *           type: integer
  *           format: int64
  *       - name: absenceId
  *         description: Absence id
  *         in: path
  *         schema:
  *           type: integer
  *           format: int64
  */
  router.get('/:absenceId', absenceController.get)

  /**
  * @swagger
  * /profiles/{id}/absences/{absenceId}:
  *   put:
  *     description: Update absence
  *     tags:
  *       - profiles
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing the updated absence
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/absence"
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
  *       - name: absenceId
  *         in: path
  *         schema:
  *           type: integer
  *           format: int64
  *     requestBody:
  *       content:
  *         application/json:
  *           schema:
  *             $ref: "#/components/schemas/absence"
  */
  router.put('/:absenceId', absenceController.update)

  /**
  * @swagger
  * /profiles/{id}/absences/{absenceId}:
  *   delete:
  *     description: Delete an absence from profile
  *     tags:
  *       - profiles
  *     produces:
  *       - application/json
  *     responses:
  *       404:
  *         description: Not found
  *     parameters:
  *       - name: id
  *         in: path
  *         schema:
  *           type: integer
  *           format: int64
  *       - name: absenceId
  *         in: path
  *         schema:
  *           type: integer
  *           format: int64
  */
  router.delete('/:absenceId', absenceController.delete)

  return router
}
