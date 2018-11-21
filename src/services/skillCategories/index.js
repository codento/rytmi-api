import CrudService from '../crud'
import models from '../../db/models'

export default class SkillCategoryService extends CrudService {
  constructor () {
    super(models.SkillCategory)
  }
}
