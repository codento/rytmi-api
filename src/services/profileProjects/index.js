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

}
