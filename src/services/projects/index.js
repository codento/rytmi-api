import CrudService from '../crud'
import models from '../../db/models'
import { genericGetAll, genericGet } from '../utils'

const mapDescriptionsToModel = (project, projectDescriptions) => {
  const descriptions = []
  projectDescriptions.forEach(description => descriptions.push({
    name: description ? description.name : '',
    description: description ? description.description : '',
    language: description ? description.language : ''
  }))

  return {
    id: project.id,
    code: project.code,
    startDate: project.startDate,
    endDate: project.endDate,
    isSecret: project.isSecret,
    descriptions: descriptions
  }
}

export default class ProjectService extends CrudService {
  constructor () {
    super(models.project)
  }

  async getAll () {
    return genericGetAll(models.project, models.projectDescription, mapDescriptionsToModel)
  }

  async get (id) {
    return genericGet(models.project, models.projectDescription, mapDescriptionsToModel, id, 'projectId')
  }
}
