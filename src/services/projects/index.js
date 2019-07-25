import CrudService from '../crud'
import models from '../../db/models'

export default class ProjectService extends CrudService {
  constructor () {
    super(models.project)
  }

  async create (attrs) {
    delete attrs.id
    let project = models.project.build(attrs)
    project = await project.save()
    if (attrs.skills) {
      await project.setSkills(models.skill.build(attrs.skills))
    }
    return models.project.findByPk(project.id, {
      include: [{
        model: models.skill
      }]
    })
  }

  // Overrides CrudService's function
  async getAll () {
    return models.project.findAll({
      include: [{
        model: models.skill
      }],
      order: [['id']]
    })
  }

  // Overrides CrudService's function
  async get (id) {
    return models.project.findByPk(id, {
      include: [{
        model: models.skill
      }]
    })
  }

  // Overrides CrudService's function
  async update (id, attrs) {
    attrs.id = parseInt(id)
    await models.project.update(attrs, { where: { id } })
    const project = await models.project.findOne({
      include: [{
        model: models.skill
      }],
      where: { id } })
    if (attrs.skills) {
      await project.setSkills(models.skill.build(attrs.skills))
    }
    return models.project.findOne({
      include: [{
        model: models.skill
      }],
      where: { id: id } })
  }

  // Overrides CrudService's function
  delete (id) {
    return models.project.findByPk(id)
      .then(modelInstance => {
        return modelInstance
          .destroy()
      })
  }
}
