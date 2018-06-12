import CrudService from '../crud'
import models from '../../db/models'

export default class ProfileProjectService extends CrudService {
  constructor () {
    super(models.ProfileProject)
  }

  getAll () {
    return models.ProfileProject.findAll()
  }

  getByProfileId (profileId) {
    return models.ProfileProject.findAll({where: {profileId: profileId}})
  }

  getByProjectId (projectId) {
    return models.ProfileProject.findAll({where: {projectId: projectId}})
  }

  getByIds (profileId, projectId) {
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

  update (id, attrs) {
    return models.ProfileProject
      .findOne({where: {
        id: id
      }})
      .then(ProfileProject => {
        return ProfileProject
          .update(attrs)
      })
  }
}
