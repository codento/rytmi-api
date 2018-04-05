import ProfileProjectService from '../../services/profileProjects'
import baseController from '../index'
import {findObjectOr404, wrapAsync} from '../utils'
import {errorTemplate} from '../../api/utils'

const profileProjectService = new ProfileProjectService()

let profileProjectController = baseController('ProfileProject', profileProjectService)

profileProjectController.getAll = wrapAsync(async (req, res) => {
  const profileProjects = await profileProjectService.getAll()
  res.json(profileProjects)
})

profileProjectController.getAllInProject = wrapAsync(async (req, res) => {
  const projectsProfiles = await profileProjectService.getProjectsProfiles(req.project.id)
  res.json(projectsProfiles)
})

profileProjectController.getProfilesProjects = wrapAsync(async (req, res) => {
  const profilesProjects = await profileProjectService.getProfilesProjects(req.params.profileId)
  res.json(profilesProjects)
})

profileProjectController.create = wrapAsync(async (req, res) => {
  const project = req.project
  const profileProject = await profileProjectService.create(project.id, req.body)
  res.status(201).json(profileProject)
})

profileProjectController.update = wrapAsync(async (req, res) => {
  const profileProject = await profileProjectService.update(req.ProfileProject.ProfileId, req.ProfileProject.ProjectId, req.body)
  res.json(profileProject)
})

profileProjectController.delete = wrapAsync(async (req, res) => {
  const profileProject = await profileProjectService.delete(req.ProfileProject.ProfileId, req.ProfileProject.ProjectId, req.body)
  res.json(profileProject)
})

function findObjectByProfileOr404 (req, res, next, value) {
  const profile = req.profile
  profileProjectService.getByIds(profile.id, value)
    .then(ProfileProject => {
      if(ProfileProject) {
        req.ProfileProject = ProfileProject
        next()
      } else {
        res.status(404).json(errorTemplate(404, 'profileProject not found'))
      }
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

function findObjectByProjectOr404 (req, res, next, value) {
  const project = req.project
  profileProjectService.getByIds(value, project.id)
    .then(ProfileProject => {
      if(ProfileProject) {
        req.ProfileProject = ProfileProject
        next()
      } else {
        res.status(404).json(errorTemplate(404, 'profileProject not found'))
      }
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

module.exports = {
  profileProjectController: profileProjectController,
  findObjectOr404: findObjectOr404('ProfileProject', profileProjectService),
  findObjectByProfileOr404: findObjectByProfileOr404,
  findObjectByProjectOr404: findObjectByProjectOr404
}
