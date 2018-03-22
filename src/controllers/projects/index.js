import ProjectService from '../../services/projects'
import baseController from '../index'
import {findObjectOr404, wrapAsync} from '../utils'

const projectService = new ProjectService()

let projectController = baseController('project', projectService)

projectController.getAll = wrapAsync(async (req, res) => {
  const projects = await projectService.getAll()
  res.json(projects)
})

module.exports = {
  projectController: projectController,
  findObjectOr404: findObjectOr404('project', projectService)
}
