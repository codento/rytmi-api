import CrudService from '../crud'
import models from '../../db/models'
import { genericGetAll, genericGet } from '../utils'

const mapDescriptionsToModel = (project, projectDescriptions) => {
  const descriptions = []
  projectDescriptions.forEach(description => descriptions.push({
    id: description ? description.id : '',
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
    return genericGetAll(models.project, models.projectDescription, mapDescriptionsToModel, 'projectId')
  }

  async get (id) {
    return genericGet(models.project, models.projectDescription, mapDescriptionsToModel, id, 'projectId')
  }

  async update (id, attrs) {
    const idInt = parseInt(id)

    await models.project.update(
      {
        code: attrs.code,
        startDate: attrs.startDate,
        endDate: attrs.endDate,
        isSecret: attrs.isSecret
      },
      {
        where:
          {
            id: idInt
          }
      }
    )
    for (const description of attrs.descriptions) {
      await models.projectDescription.update(
        {
          name: description.name,
          description: description.description
        },
        {
          where:
            {
              id: description.id
            }
        }
      )
    }
    return this.get(idInt)
  }
}
