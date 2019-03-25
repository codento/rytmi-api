import CrudService from '../crud'
import models from '../../db/models'
import { DEFAULT_LANGUAGE, genericGetAll, genericGet } from '../utils'

const mapModelToModelDescription = (project, projectDescription) => ({
  id: project.id,
  code: project.code,
  startDate: project.startDate,
  endDate: project.endDate,
  isSecret: project.isSecret,
  name: projectDescription ? projectDescription.name : '',
  description: projectDescription ? projectDescription.description : '',
  language: projectDescription ? projectDescription.language : ''
})

export default class ProjectService extends CrudService {
  constructor () {
    super(models.project)
  }

  async getAll (language = DEFAULT_LANGUAGE) {
    return genericGetAll(models.project, models.projectDescription, mapModelToModelDescription, language)
  }

  async get (id, language = DEFAULT_LANGUAGE) {
    return genericGet(models.project, models.projectDescription, mapModelToModelDescription, language, id, 'projectId')
  }
}
