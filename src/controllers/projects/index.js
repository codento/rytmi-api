import ProjectService from '../../services/projects'
import baseController from '../index'
import {findObjectOr404, wrapAsync} from '../utils'

const projectService = new ProjectService()

let projectController = baseController('project', projectService)

projectController.delete = wrapAsync(async (req, res) => {
  const removed = await projectService.delete(req.project.id)
  res.status(200).send('Project with id: ' + req.project.id + ' was removed successfully.')
})

module.exports = {
  projectController: projectController,
  findObjectOr404: findObjectOr404('project', projectService)
}
