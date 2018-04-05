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
    return models.ProfileProject.findAll({where: {ProfileId: profileId}})
  }

  getProjectsProfiles (projectId) {
    return models.ProfileProject.findAll({where: {ProjectId: projectId}})
  }

  getByIds(profileId, projectId) {
    return models.ProfileProject.findOne({
      where: {
        ProfileId: profileId,
        ProjectId: projectId
      }
    })
  }

  create (projectId, attrs) {
    attrs.ProjectId = parseInt(projectId)
    return super.create(attrs)
  }

  update (profileId, projectId, attrs) {
    attrs.ProfileId = parseInt(profileId)
    attrs.ProjectId = parseInt(projectId)
    return models.ProfileProject
      .findOne({where: {
        ProfileId: profileId,
        ProjectId: projectId
      }})
      .then(ProfileProject => {
        return ProfileProject
          .update(attrs)
      })
  }

  delete (profileId, projectId) {
    return models.ProfileProject
      .findOne({where: {
        ProfileId: profileId,
        ProjectId: projectId
      }})
      .then(ProfileProject => {
        return ProfileProject
          .destroy()
      })
  }

}
