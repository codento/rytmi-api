
import { wrapAsync } from './utils'

export default function (objName, service, validator = null) {
  return {
    getAll: wrapAsync(async (req, res) => {
      const collection = await service.getAll(req.query.language)
      res.json(collection)
    }),
    get: wrapAsync(async (req, res) => {
      const obj = await service.get(req.params.id, req.query.language)
      res.json(obj)
    }),
    create: wrapAsync(async (req, res) => {
      const obj = await service.create(req.body)
      res.status(201).json(obj)
    }),
    update: wrapAsync(async (req, res) => {
      if (validator) {
        validator.validate(req.body)
      }
      const obj = await service.update(req[objName].id, req.body)
      res.json(obj)
    })
  }
}
