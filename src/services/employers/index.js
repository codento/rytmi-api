import CrudService from '../crud'
import models from '../../db/models'
import { genericGetAll, genericGet } from '../utils'

const mapDescriptionsToModel = (employer, employerDescriptions) => {
  const descriptions = []
  employerDescriptions.forEach(description => descriptions.push({
    title: description ? description.title : '',
    description: description ? description.description : '',
    language: description ? description.language : ''
  }))

  return {
    id: employer.id,
    name: employer.name,
    startDate: employer.startDate,
    endDate: employer.endDate,
    isSecret: employer.isSecret,
    descriptions: descriptions
  }
}

export default class EmployerService extends CrudService {
  constructor () {
    super(models.employer)
  }

  async getAll () {
    return genericGetAll(models.employer, models.employerDescription, mapDescriptionsToModel, 'employerId')
  }

  async get (id) {
    return genericGet(models.employer, models.employerDescription, mapDescriptionsToModel, id, 'employerId')
  }
}
