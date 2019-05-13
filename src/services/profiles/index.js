import CrudService from '../crud'
import models from '../../db/models'
import { genericGetAll, genericGet, genericUpdate } from '../utils'

const mapCvDescriptionsToProfile = (profile, profileCvDescriptions) => {
  const cvDescriptions = []
  profileCvDescriptions.forEach(description => cvDescriptions.push({
    id: description ? description.id : '',
    name: description ? description.name : '',
    description: description ? description.description : '',
    type: description ? description.type : '',
    language: description ? description.language : ''
  }))

  if (profile) {
    return {
      ...profile.dataValues,
      cvDescriptions: cvDescriptions
    }
  }
  return null
}

export default class ProfileService extends CrudService {
  constructor () {
    super(models.profile)
  }

  // Overrides CrudService's function
  get (id) {
    return genericGet(models.profile, models.profileCvDescription, mapCvDescriptionsToProfile, id, 'profileId')
  }

  // Overrides CrudService's function
  getFiltered (criteria, isParanoid = true) {
    return genericGetAll(models.profile, models.profileCvDescription, mapCvDescriptionsToProfile, 'profileId', criteria, isParanoid)
  }

  // Overrides CrudService's function
  async update (id, attrs) {
    return genericUpdate(models.profile, models.profileCvDescription, id, attrs, 'profileId', this.get, 'cvDescriptions')
  }

  // Overrides CrudService's function
  delete () {
    throw new Error('Not implemented')
  }
}
