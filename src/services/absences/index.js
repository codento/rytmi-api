import CrudService from '../crud'
import models from '../../db/models'

export default class AbsenceService extends CrudService {
  constructor () {
    super(models.absence)
  }

  getByProfileId (profileId) {
    return models.absence
      .findAll({ where: { profileId: profileId } })
  }
}
