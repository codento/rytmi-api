import CrudService from '../crud'
import models from '../../db/models'
import { genericGetAll, genericGet, genericDelete, genericUpdate, genericCreate } from '../utils'

const Op = models.sequelize.Op

const mapDescriptionsToModel = (profileProject, profileProjectDescriptions) => {
  const descriptions = []
  profileProjectDescriptions.forEach(description => descriptions.push({
    title: description.title,
    language: description.language,
    id: description.id
  }))
  if (profileProject) {
    return {
      id: profileProject.id,
      profileId: profileProject.profileId,
      projectId: profileProject.projectId,
      startDate: profileProject.startDate,
      endDate: profileProject.endDate,
      workPercentage: profileProject.workPercentage,
      descriptions: descriptions
    }
  }
  return null
}

export default class ProfileProjectService extends CrudService {
  constructor () {
    super(models.profileProject)
  }

  async getInFuture () {
    return genericGetAll(models.profileProject, models.profileProjectDescription, mapDescriptionsToModel, 'profileProjectId', {
      endDate: {
        [Op.or]: {
          [Op.eq]: null,
          [Op.gt]: new Date()
        }
      }
    })
  }

  // Overrides CrudService's function
  async getAll () {
    return genericGetAll(models.profileProject, models.profileProjectDescription, mapDescriptionsToModel, 'profileProjectId')
  }

  // Overrides CrudService's function
  async get (id) {
    return genericGet(models.profileProject, models.profileProjectDescription, mapDescriptionsToModel, id, 'profileProjectId')
  }

  async getByProfileId (profileId) {
    return genericGetAll(models.profileProject, models.profileProjectDescription, mapDescriptionsToModel, 'profileProjectId', {profileId: profileId})
  }

  async getByProjectId (projectId) {
    return genericGetAll(models.profileProject, models.profileProjectDescription, mapDescriptionsToModel, 'profileProjectId', {projectId: projectId})
  }

  async getByIds (profileId, projectId) {
    const profileProjects = await genericGetAll(models.profileProject, models.profileProjectDescription, mapDescriptionsToModel, 'profileProjectId', {
      profileId: profileId,
      projectId: projectId
    })
    return profileProjects ? profileProjects[0] : null
  }

  // Overrides CrudService's function
  async create (projectId, profileId, attrs) {
    attrs.projectId = parseInt(projectId)
    attrs.profileId = parseInt(profileId)
    return genericCreate(models.profileProject, models.profileProjectDescription, attrs, 'profileProjectId', this.get)
  }

  // Overrides CrudService's function
  async update (id, attrs) {
    return genericUpdate(models.profileProject, models.profileProjectDescription, id, attrs, 'profileProjectId', this.get)
  }

  // Overrides CrudService's function
  async delete (id) {
    return genericDelete(models.profileProject, models.profileProjectDescription, id, 'profileProjectId')
  }
}
