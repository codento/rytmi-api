import ProfileProjectService from '../../services/profileProjects'
import baseController from '../index'
import {findObjectOr404, wrapAsync} from '../utils'

const profileProjectService = new ProfileProjectService()

let profileProjectController = baseController('profileProject', profileProjectService)

profileProjectController.getAll = wrapAsync(async (req, res) => {
  const profileProjects = await profileProjectService.getAll()
  res.json(profileProjects)
})

module.exports = {
  profileProjectController: profileProjectController,
  findObjectOr404: findObjectOr404('profileProject', profileProjectService)
}
