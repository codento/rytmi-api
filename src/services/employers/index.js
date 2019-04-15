import CrudService from '../crud'
import models from '../../db/models'
import { genericGetAll, genericGet } from '../utils'

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

  async getAll () {
    return genericGetAll(models.employer, models.employerDescription, mapDescriptionsToModel, 'employerId')
  }

  async get (id) {
    return genericGet(models.employer, models.employerDescription, mapDescriptionsToModel, id, 'employerId')
  }

  async update (id, attrs) {
    const idInt = parseInt(id)

    await models.employer.update(
      {
        profileId: attrs.profileId,
        name: attrs.name,
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
      if (description.id) {
        await models.employerDescription.update({title: description.title, description: description.description}, {where: {id: description.id}})
      } else {
        await models.employerDescription.build({
          ...description,
          employerId: idInt
        }).save()
      }
    }
    return this.get(idInt)
  }

  async create (attrs) {
    delete attrs.id
    const newEmployer = await this.model
      .build(attrs)
      .save()
      .then(created => this.get(created.id))

    for (const description of attrs.descriptions) {
      await models.employerDescription.build({
        ...description,
        employerId: newEmployer.id
      }).save()
    }

    return this.get(newEmployer.id)
  }
}
