import ProfileProjectService from '../../services/profileProjects'
import baseController from '../index'
import {findObjectOr404, wrapAsync} from '../utils'
import {errorTemplate} from '../../api/utils'

const profileProjectService = new ProfileProjectService()

let profileProjectController = baseController('profileProject', profileProjectService)

profileProjectController.getList = wrapAsync(async (req, res) => {
  const qs = req.query
  let infuture = false
  if ('infuture' in qs) {
    if (qs.infuture === 'true') {
      infuture = true
    } else {
      res.status(404).json(errorTemplate(400, 'infuture accepts only \'true\''))
    }
  }

  const profileProjects = infuture
    ? await profileProjectService.getInFuture()
    : await profileProjectService.getAll()

  res.json(profileProjects)
})

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
  await profileProjectService.delete(req.profileProject.id)
  res.status(204).send()
})

function findProjectFromProfileOr404 (req, res, next, value) {
  const profile = req.profile
  profileProjectService.getByIds(profile.id, value)
    .then(ProfileProject => {
      if (ProfileProject) {
        req.profileProject = ProfileProject
        next()
      } else {
        res.status(404).json(errorTemplate(404, 'profileProject not found'))
      }
    })
}

function findProfileFromProjectOr404 (req, res, next, value) {
  const project = req.project
  profileProjectService.getByIds(value, project.id)
    .then(ProfileProject => {
      if (ProfileProject) {
        req.profileProject = ProfileProject
        next()
      } else {
        res.status(404).json(errorTemplate(404, 'profileProject not found'))
      }
    })
}

module.exports = {
  profileProjectController: profileProjectController,
  findProfileProjectOr404: findObjectOr404('profileProject', profileProjectService),
  findProjectFromProfileOr404: findProjectFromProfileOr404,
  findProfileFromProjectOr404: findProfileFromProjectOr404
}
