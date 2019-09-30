import CrudService from '../crud'
import models from '../../db/models'

export default class ProfileService extends CrudService {
  constructor () {
    super(models.profile)
  }

  getProfileByUserId (userId) {
    return models.profile.findOne({where: {userId: userId}})
  }

  getFiltered (criteria, isParanoid = true) {
    return this.model
      .findAll({ where: criteria, paranoid: isParanoid, include: [{ model: models.absence }] })
  }

  get (id) {
    return this.model
      .findByPk(id, { attributes: {exclude: ['deletedAt']}, include: [models.absence] })
  }

  async update (id, attr) {
    id = parseInt(id)
    const profile = await this.model.findByPk(id, { include: [models.absence] })
    if (attr.absences) {
      const absences = models.absence.build(attr.absences)
      await profile.setAbsences(absences)
    }

    return profile.update(attr, { where: { id }, include: [models.absence] })
  }

  // Overrides CrudService's function
  create (attrs) {
    return models.profile
      .create(attrs, { include: [{model: models.absence}] })
      .then(created => this.get(created.id))
  }

  // Overrides CrudService's function
  delete () {
    throw new Error('Not implemented')
  }
}
