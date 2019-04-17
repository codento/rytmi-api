import CrudService from '../crud'
import models from '../../db/models'
import { genericGetAll, genericGet, genericDelete, genericUpdate, genericCreate } from '../utils'

const mapDescriptionsToModel = (employer, employerDescriptions) => {
  const descriptions = []
  employerDescriptions.forEach(description => descriptions.push({
    id: description.id,
    title: description.title,
    description: description.description,
    language: description.language
  }))

  if (employer) {
    return {
      id: employer.id,
      profileId: employer.profileId,
      name: employer.name,
      startDate: employer.startDate,
      endDate: employer.endDate,
      isSecret: employer.isSecret,
      descriptions: descriptions
    }
  }
  return null
}

export default class EmployerService extends CrudService {
  constructor () {
    super(models.employer)
  }

  // Overrides CrudService's function
  async getAll () {
    return genericGetAll(models.employer, models.employerDescription, mapDescriptionsToModel, 'employerId')
  }

  // Overrides CrudService's function
  async get (id) {
    return genericGet(models.employer, models.employerDescription, mapDescriptionsToModel, id, 'employerId')
  }

  // Overrides CrudService's function
  async update (id, attrs) {
    return genericUpdate(models.employer, models.employerDescription, id, attrs, 'employerId', this.get)
  }

  // Overrides CrudService's function
  async create (attrs) {
    delete attrs.id
    return genericCreate(models.employer, models.employerDescription, attrs, 'employerId', this.get)
  }

  // Overrides CrudService's function
  async delete (id) {
    return genericDelete(models.employer, models.employerDescription, id, 'employerId')
  }
}
