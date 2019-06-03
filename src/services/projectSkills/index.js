import CrudService from '../crud'
import models from '../../db/models'

export default class ProjectSkillService extends CrudService {
  constructor () {
    super(models.projectSkill)
  }

  async getAll (req, res) {
    const options = req.query.projectId ? { where: { projectId: req.query.projectId } } : undefined
    return models.projectSkill.findAll(options)
  }

  async get (id) {
    return models.projectSkill.findOne({where: {id: id}})
  }

  removeDeletedAt (criteria) {
    return this.model.findAll({ where: criteria, paranoid: false }).then(result => {
      const toBeSaved = result.map(model => {
        model.setDataValue('deletedAt', null)
        return model.save()
      })
      return Promise.all(toBeSaved)
    })
  }

  // Overrides CrudService's function
  create (attrs) {
    return this.model.findOne({ where: { skillId: attrs.skillId }, paranoid: false })
      .then((projectSkill) => {
        if (projectSkill && projectSkill.deletedAt !== null) {
          return this.removeDeletedAtAndUpdate(projectSkill, attrs)
        }
        return super.create(attrs)
      })
  }

  removeDeletedAtAndUpdate (projectSkill, attrs) {
    projectSkill.setDataValue('deletedAt', null)
    return projectSkill.update(attrs).then(projectSkill => {
      return projectSkill.save()
    })
  }
}
