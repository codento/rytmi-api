import { Router } from 'express'
import {profileSkillController, findProfileSkillFromProfileOr404} from '../../../controllers/profileSkills'
import { createPermissionHandler } from '../../utils'

const router = Router()
const permissionHandler = createPermissionHandler('profile', 'id')

export default () => {
  router.param('profileSkillId', findProfileSkillFromProfileOr404)
  router.use(permissionHandler)

  /**
  * @swagger
  * /profiles/{id}/skills:
  *   get:
  *     description: A list of profile skills
  *     tags:
  *       - profiles
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
  *                 $ref: "#/components/schemas/profileSkill"
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
  router.get('/', profileSkillController.getByProfile)

  /**
  * @swagger
  * /profiles/{id}/skills:
  *   post:
  *     description: Post new skill
  *     tags:
  *       - profiles
  *     produces:
  *       - application/json
  *     responses:
  *       204:
  *         description: A JSON object containing the new profile skill
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/profileSkill"
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
  *             $ref: "#/components/schemas/profileSkill"
  */
  router.post('/', profileSkillController.create)

  /**
  * @swagger
  * /profiles/{id}/skills/{profileSkillId}:
  *   get:
  *     description: Retrieve skills of profile
  *     tags:
  *       - profiles
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing a profile skill
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/profileSkill"
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
  *       - name: profileSkillId
  *         desription: Profile skill id
  *         in: path
  *         schema:
  *           type: integer
  *           format: int64
  */
  router.get('/:profileSkillId', profileSkillController.get)

  /**
  * @swagger
  * /profiles/{id}/skills/{profileSkillId}:
  *   put:
  *     description: Update skill of profile
  *     tags:
  *       - profiles
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: A JSON object containing teh updated profile skill
  *         content:
  *           application/json:
  *             schema:
  *               $ref: "#/components/schemas/*profileSkill"
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
  *       - name: profileSkillId
  *         in: path
  *         schema:
  *           type: integer
  *           format: int64
  *     requestBody:
  *       content:
  *         application/json:
  *           schema:
  *             $ref: "#/components/schemas/profileSkill"
  */
  router.put('/:profileSkillId', profileSkillController.update)

  /**
  * @swagger
  * /profiles/{id}/skills/{profileSkillId}:
  *   delete:
  *     description: Delete skill from profile
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
  *       - name: profileSkillId
  *         in: path
  *         schema:
  *           type: integer
  *           format: int64
  */
  router.delete('/:profileSkillId', profileSkillController.delete)

  return router
}
