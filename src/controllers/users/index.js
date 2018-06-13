import UserService from '../../services/users'
import baseController from '../index'
import {findObjectOr404} from '../utils'

const userService = new UserService()

module.exports = {
  userController: baseController('user', userService),
  findUserOr404: findObjectOr404('user', userService)
}
