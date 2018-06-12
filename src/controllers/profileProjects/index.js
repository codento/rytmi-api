import ProfileProjectService from '../../services/profileProjects'
import baseController from '../index'
import {findObjectOr404, wrapAsync} from '../utils'
import {errorTemplate} from '../../api/utils'

const profileProjectService = new ProfileProjectService()

let profileProjectController = baseController('ProfileProject', profileProjectService)

profileProjectController.getByProject = wrapAsync(async (req, res) => {
  const projectsProfiles = await profileProjectService.getByProjectId(req.project.id)
  res.json(projectsProfiles)
})

profileProjectController.getByProfile = wrapAsync(async (req, res) => {
  const profilesProjects = await profileProjectService.getByProfileId(req.profile.id)
  res.json(profilesProjects)
})

profileProjectController.getByIds = wrapAsync(async (req, res) => {
  const profile = req.profile
  const project = req.project
  const profileProjects = await profileProjectService.getByIds(profile.id, project.id)
  res.json(profileProjects)
})

profileProjectController.create = wrapAsync(async (req, res) => {
  const project = req.project
  const profile = req.profile
  const profileProject = await profileProjectService.create(project.id, profile.id, req.body)
  res.status(201).json(profileProject)
})

profileProjectController.delete = wrapAsync(async (req, res) => {
  const profileProject = await profileProjectService.delete(req.ProfileProject.id)
  res.status(200).send("Projects profile with id: " + req.ProfileProject.id + ", was removed successfully")
})

function findObjectByProfileOr404 (req, res, next, value) {
  const profile = req.profile
  profileProjectService.getByIds(profile.id, value)
    .then(ProfileProject => {
      if (ProfileProject) {
        req.ProfileProject = ProfileProject
        next()
      } else {
        res.status(404).json(errorTemplate(404, 'profileProject not found'))
      }
    })
}

function findObjectByProjectOr404 (req, res, next, value) {
  const project = req.project
  profileProjectService.getByIds(value, project.id)
    .then(ProfileProject => {
      if (ProfileProject) {
        req.ProfileProject = ProfileProject
        next()
      } else {
        res.status(404).json(errorTemplate(404, 'profileProject not found'))
      }
    })
}

module.exports = {
  profileProjectController: profileProjectController,
  findObjectOr404: findObjectOr404('ProfileProject', profileProjectService),
  findObjectByProfileOr404: findObjectByProfileOr404,
  findObjectByProjectOr404: findObjectByProjectOr404
}
