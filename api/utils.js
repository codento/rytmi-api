let utils = module.exports = {
  errorTemplate: (statusCode, message) => {
    return {
      error: {
        code: statusCode,
        message: message
      }
    }
  },
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
              .json(utils.errorTemplate(404, objName + ' not found'))
          }
        })
        .catch(err => {
          res.status(500).send(err)
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
