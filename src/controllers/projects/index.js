import ProjectService from '../../services/projects'
import ProfileProjectService from '../../services/profileProjects'
import baseController from '../index'
import {findObjectOr404, wrapAsync} from '../utils'

const projectService = new ProjectService()

let projectController = baseController('project', projectService)

const profileProjectService = new ProfileProjectService()

projectController.delete = wrapAsync(async (req, res) => {
  let profileProjectsToBeRemoved = profileProjectService.getProjectsProfiles(req.project.id)
  for (var i = 0; i < profileProjectsToBeRemoved.length; i++) {
    profileProjectService.delete(profileProjectsToBeRemoved[i].id)
  }
  const removed = await projectService.delete(req.project.id)
  res.status(200).send('Project with id: ' + req.project.id + ' was removed successfully.')
})

module.exports = {
  projectController: projectController,
  findObjectOr404: findObjectOr404('project', projectService)
}
