import CrudService from '../crud'
import models from '../../db/models'

export default class SkillGroupService extends CrudService {
  constructor () {
    super(models.SkillGroup)
  }
}