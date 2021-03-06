import {errorTemplate} from '../api/utils'

module.exports = {
  findObjectOr404: (objName, service) => {
    return (req, res, next, value) => {
      service.get(value)
        .then(obj => {
          if (obj) {
            req[objName] = obj
            next()
          } else {
            res
              .status(404)
              .json(errorTemplate(404, objName + ' not found'))
          }
        }).catch(error => {
          console.error(error)
          res
            .status(500)
            .json(errorTemplate(500, 'Internal server error', error))
        })
    }
  },
  wrapAsync: (fn) => {
    return function (req, res, next) {
      // Make sure to `.catch()` any errors and pass them along to the `next()`
      // middleware in the chain, in this case the error handler.
      fn(req, res, next)
        .catch(next)
    }
  }
}
