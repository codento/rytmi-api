import CrudService from '../crud'
import models from '../../db/models'
import { genericGetAll, genericGet } from '../utils'

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
      id: profile.id,
      userId: profile.userId,
      lastName: profile.lastName,
      firstName: profile.firstName,
      birthday: profile.birthday,
      email: profile.email,
      phone: profile.phone,
      title: profile.title,
      links: profile.links,
      photoPath: profile.photoPath,
      active: profile.active,
      employeeRoles: profile.employeeRoles,
      cvDescriptions: cvDescriptions
    }
  }
  return null
}

export default class ProfileService extends CrudService {
  constructor () {
    super(models.profile)
  }

  get (id) {
    return genericGet(models.profile, models.profileCvDescription, mapCvDescriptionsToProfile, id, 'profileId')
  }

  getFiltered (criteria, isParanoid = true) {
    return genericGetAll(models.profile, models.profileCvDescription, mapCvDescriptionsToProfile, 'profileId', criteria, isParanoid)
  }
  async update (id, attrs) {
    await models.profile.update(
      {
        lastName: attrs.lastName,
        firstName: attrs.firstName,
        birthday: attrs.birthday,
        email: attrs.email,
        phone: attrs.phone,
        title: attrs.title,
        links: attrs.links,
        photoPath: attrs.photoPath,
        active: attrs.active,
        employeeRoles: attrs.employeeRoles
      },
      {
        where:
          {
            id: id
          }
      }
    )
    for (const description of attrs.cvDescriptions) {
      await models.profileCvDescription.update(
        {
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
    return this.get(id)
  }

  delete () {
    throw new Error('Not implemented')
  }
}
