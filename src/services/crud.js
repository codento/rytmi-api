export default class CrudService {
  constructor (model) {
    this.model = model
  }

  get (id) {
    return this.model
      .findById(id)
  }

  getAll () {
    return this.model
      .findAll()
  }

  create (attrs) {
    delete attrs.id
    return this.model
      .build(attrs)
      .save()
  }

  update (id, attrs) {
    attrs.id = parseInt(id)
    return this.model
      .findById(id)
      .then(modelInstance => {
        return modelInstance
          .update(attrs)
      })
  }

  delete (id) {
    return this.model
      .findById(id)
      .then(modelInstance => {
        return modelInstance
          .destroy()
      })
  }
}
