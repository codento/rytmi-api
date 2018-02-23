
import {wrapAsync} from './utils'

export default function (objName, service) {
  return {
    getAll: wrapAsync(async (req, res) => {
      const collection = await service.getAll()
      res.json(collection)
    }),
    get: wrapAsync(async (req, res) => {
      const obj = req[objName]
      res.json(obj)
    }),
    create: wrapAsync(async (req, res) => {
      const obj = await service.create(req.body)
      res.status(201).json(obj)
    }),
    update: wrapAsync(async (req, res) => {
      const obj = await service.update(req[objName].id, req.body)
      res.json(obj)
    })
  }
}
