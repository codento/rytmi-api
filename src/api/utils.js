import PermissionDeniedError from '../validators/permissionDeniedError'

module.exports = {
  errorTemplate: (statusCode, message, details = null) => {
    let errorResponse = {
      error: {
        code: statusCode,
        message: message
      }
    }
    if (details) {
      errorResponse.error.details = details
    }

    return errorResponse
  },
  createPermissionHandler: (objName, key) => {
    return (req, res, next) => {
      const methods = ['POST', 'PUT', 'DELETE']
      if (methods.includes(req.method)) {
        if (!req.user.admin && req.user.userId !== req[objName][key]) {
          throw new PermissionDeniedError('Permission denied')
        }
      }
      next()
    }
  }
}
