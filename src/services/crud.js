export default class CrudService {
  constructor (model) {
    this.model = model
  }

  get (id) {
    return this.model
      .findByPk(id, {attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] }})
  }

  getAll () {
    return this.model
      .findAll({attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] }})
  }

  getFiltered (criteria, isParanoid = true) {
    return this.model
      .findAll({where: criteria, paranoid: isParanoid, attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] }})
  }

  create (attrs) {
    delete attrs.id
    return this.model
      .build(attrs)
      .save()
      .then(created => this.get(created.id))
  }

  update (id, attrs) {
    attrs.id = parseInt(id)
    return this.get(id)
      .then(modelInstance => {
        return modelInstance
          .update(attrs)
      })
  }

  delete (id) {
    return this.get(id)
      .then(modelInstance => {
        return modelInstance
          .destroy()
      })
  }
}
