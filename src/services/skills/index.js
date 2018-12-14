import CrudService from '../crud'
import models from '../../db/models'

export default class SkillService extends CrudService {
  constructor () {
    super(models.Skill)
  }

  removedDeletedAt (id) {
    return this.model.findById(id, { paranoid: false }).then(model => {
      model.setDataValue('deletedAt', null)
      return model.save({ paranoid: false })
    })
  }
}
