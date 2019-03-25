import CrudService from '../crud'
import models from '../../db/models'
import { DEFAULT_LANGUAGE, genericGetAll, genericGet } from '../utils'

const mapModelToModelDescription = (employer, employerDescription) => ({
  id: employer.id,
  name: employer.name,
  startDate: employer.startDate,
  endDate: employer.endDate,
  isSecret: employer.isSecret,
  title: employerDescription ? employerDescription.title : '',
  description: employerDescription ? employerDescription.description : '',
  language: employerDescription ? employerDescription.language : ''
})

export default class EmployerService extends CrudService {
  constructor () {
    super(models.employer)
  }

  async getAll (language = DEFAULT_LANGUAGE) {
    return genericGetAll(models.employer, models.employerDescription, mapModelToModelDescription, language)
  }

  async get (id, language = DEFAULT_LANGUAGE) {
    return genericGet(models.employer, models.employerDescription, mapModelToModelDescription, language, id, 'employerId')
  }
}
