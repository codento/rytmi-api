import UserService from '../../services/users'
import baseController from '../index'
import {findObjectOr404, wrapAsync} from '../utils'

const userService = new UserService()

const userController = baseController('userObj', userService)

userController.delete = wrapAsync(async (req, res) => {
  await userService.delete(req.params.id)
  res.status(204).send()
})

module.exports = {
  userController,
  findUserOr404: findObjectOr404('userObj', userService)
}
