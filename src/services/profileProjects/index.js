import CrudService from '../crud'
import models from '../../db/models'
import { genericGetAll, genericGet } from '../utils'

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

    const newProfileProject = await this.model
      .build(attrs)
      .save()
      .then(created => this.get(created.id))

    for (const description of attrs.descriptions) {
      await models.profileProjectDescription.build({
        ...description,
        profileProjectId: newProfileProject.id
      }).save()
    }

    return this.get(newProfileProject.id)
  }

  // Overrides CrudService's function
  async update (id, attrs) {
    const idInt = parseInt(id)
    await models.profileProject.update(attrs, { where: { id: idInt } })
    for (const description of attrs.descriptions) {
      if (description.id) {
        await models.profileProjectDescription.update({title: description.title}, {where: {id: description.id}})
      } else {
        await models.profileProjectDescription.build({
          ...description,
          profileProjectId: idInt
        }).save()
      }
    }
    return this.get(idInt)
  }

  // Overrides CrudService's function
  async delete (id) {
    await models.profileProjectDescription.destroy({where: { profileProjectId: id }})
    await models.profileProject.destroy({where: { id: id }})
    return { id }
  }
}
