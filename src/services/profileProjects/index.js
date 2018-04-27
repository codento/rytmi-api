import CrudService from '../crud'
import models from '../../db/models'

export default class ProfileProjectService extends CrudService {
  constructor () {
    super(models.ProfileProject)
  }

  getAll () {
    return models.ProfileProject.findAll()
  }

  getProfilesProjects (profileId) {
    return models.ProfileProject.findAll({where: {profileId: profileId}})
  }

  getProjectsProfiles (projectId) {
    return models.ProfileProject.findAll({where: {projectId: projectId}})
  }

  getByIds(profileId, projectId) {
    return models.ProfileProject.findOne({
      where: {
        profileId: profileId,
        projectId: projectId
      }
    })
  }

  create (projectId, profileId, attrs) {
    attrs.projectId = parseInt(projectId)
    attrs.profileId = parseInt(profileId)
    return super.create(attrs)
  }

  update (profileId, projectId, attrs) {
    attrs.profileId = parseInt(profileId)
    attrs.projectId = parseInt(projectId)
    return models.ProfileProject
      .findOne({where: {
        profileId: profileId,
        projectId: projectId
      }})
      .then(ProfileProject => {
        return ProfileProject
          .update(attrs)
      })
  }

  delete (profileId, projectId) {
    return models.ProfileProject
      .findOne({where: {
        profileId: profileId,
        projectId: projectId
      }})
      .then(ProfileProject => {
        return ProfileProject
          .destroy()
      })
  }

}
