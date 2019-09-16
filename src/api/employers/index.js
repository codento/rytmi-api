import { Router } from 'express'
import { employerController, findEmployerOr404 } from '../../controllers/employers'

const router = Router()

export default () => {
  router.param('id', findEmployerOr404)

  /**
  * @swagger
  * /employers:
  *   get:
  *     description: Retrieve a list of all employers
  *     tags:
  *       - employer
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: An array of JSON objects containing employers
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *               $ref: "#/components/schemas/employer"
  *       401:
  *         description: Unauthorized
  */
  router.get('/', employerController.getAll)

  /**
  * @swagger
  * /employers:
  *   post:
  *     description: Add an employer
  *     tags:
  *       - employer
  *     produces:
  *       - application/json
  *     responses:
  *       201:
  *         description: A JSON object containing a new employer
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/employer"
  *       401:
  *         description: Unauthorized
  *     requestBody:
  *       content:
  *         application/json:
  *           schema:
  *             $ref: "#/components/schemas/employer"
  */
  router.post('/', employerController.create)

  /**
  * @swagger
  * /employers/{id}:
  *   get:
  *     description: Retrieve a single employer
  *     tags:
  *       - employer
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing an employer
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/employer"
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
  router.get('/:id', employerController.get)

  /**
  * @swagger
  * /employers/{id}:
  *   put:
  *     description: Update an employer
  *     tags:
  *       - employer
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing the updated employer
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/employer"
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
  *             $ref: "#/components/schemas/employer"
  */
  router.put('/:id', employerController.update)

  /**
   * @swagger
   * /employers/{id}:
   *   delete:
   *     description: Delete an employer
   *     tags:
   *       - employer
   *     produces:
   *       - application/json
   *     responses:
   *       204:
   *         description: The employer was deleted successfully.
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
   *             $ref: "#/components/schemas/employers"
   */
  router.delete('/:id', employerController.delete)

  return router
}
