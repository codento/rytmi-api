import PermissionDeniedError from '../validators/permissionDeniedError'

const userIsSelf = (user, id) => {
  return user.userId === id
}

const checkUserPermissions = (adminOnly, user, idToCompareWith) => {
  if (adminOnly && !user.admin) {
    throw new PermissionDeniedError('Permission denied')
  }
  if (!user.admin && !userIsSelf(user, idToCompareWith)) {
    throw new PermissionDeniedError('Permission denied')
  }
}

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
  createPermissionHandler: (objName, key, adminOnly = false) => {
    return (req, res, next) => {
      const methods = ['POST', 'PUT', 'DELETE']
      if (methods.includes(req.method)) {
        checkUserPermissions(adminOnly, req.user, req[objName][key])
      }
      next()
    }
  }
}
