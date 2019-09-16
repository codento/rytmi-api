import { Router } from 'express'
import {findSkillCategoryOr404, skillCategoryController} from '../../controllers/skillCategories'

const router = Router()

export default () => {
  router.param('id', findSkillCategoryOr404)

  /**
   * @swagger
   * /skillcategories:
   *   get:
   *     description: Retrieve a list of skill categories
   *     tags:
   *       - skills
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: An array of JSON objects containing skill categories
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: "#/components/schemas/skillCategory"
   *       401:
   *         description: Unauthorized
   */
  router.get('/', skillCategoryController.getAll)

  /**
   * @swagger
   * /skillcategories/:
   *   post:
   *     description: Create skill category
   *     tags:
   *       - skills
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: A JSON object containing the new skill category
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
   * /skillcategories/{id}:
   *   get:
   *     description: Show a single skill category
   *     tags:
   *       - skills
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A JSON object containing a skill category
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
   * /skillcategories/{id}:
   *   put:
   *     description: Update a skill category
   *     tags:
   *       - skills
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A JSON object containing the updated skill category
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
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/skillCategory"
   */
  router.put('/:id', skillCategoryController.update)

  /**
   * @swagger
   * /skillcategories/{id}:
   *   delete:
   *     description: Delete a skill category
   *     tags:
   *       - skills
   *     produces:
   *       - applicatios/json
   *     responses:
   *       204:
   *         description: The skill category was deleted successfully
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
