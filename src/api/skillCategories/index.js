import { Router } from 'express'
import {findSkillCategoryOr404, skillCategoryController} from '../../controllers/skillCategories'

const router = Router()

export default () => {
  router.param('id', findSkillCategoryOr404)

  /**
   * @swagger
   * /skillcategories:
   *   get:
   *     description: List of skillcategories
   *     tags:
   *       - skillcategories
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: "#/components/schemas/skillCategory"
   *         description: An array of JSON objects containing skillcategories
   *       401:
   *         description: Unauthorized
   */
  router.get('/', skillCategoryController.getAll)

  /**
   * @swagger
   * /skillcategories/:
   *   post:
   *     description: Update skillcategory
   *     tags:
   *       - skillcategories
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: A JSON object containing the updated skillcategory
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/skillCategory"
   *       401:
   *         description: Unauthorized
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/skillCategory"
   */
  router.post('/', skillCategoryController.create)

  /**
   * @swagger
   * /skillCategories/{id}:
   *   get:
   *     description: Show a single skillcategory
   *     tags:
   *       - skillcategories
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A JSON object containing a skillcategory
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/skillCategory"
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
  router.get('/:id', skillCategoryController.get)

  /**
   * @swagger
   * /skillCategories/{id}:
   *   put:
   *     description: Update a skillcategory
   *     tags:
   *       - skillcategories
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A JSON object containing the updated skillcategory
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/skillCategory"
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
   *             $ref: "#/components/schemas/skillCategory"
   */
  router.put('/:id', skillCategoryController.update)

  /**
   * @swagger
   * /skillCategories/{id}:
   *   delete:
   *     description: Delete a skillcategory
   *     tags:
   *       - skillcategories
   *     produces:
   *       - applicatios/json
   *     responses:
   *       204:
   *         description: skillCategory deleted
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
  router.delete('/:id', skillCategoryController.delete)

  return router
}
