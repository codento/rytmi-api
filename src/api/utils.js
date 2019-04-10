import PermissionDeniedError from '../validators/permissionDeniedError'
import models from '../db/models'

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
    return async (req, res, next) => {
      const methods = ['POST', 'PUT', 'DELETE']
      if (methods.includes(req.method)) {
        let user = req.user
        if (!user && req[objName].userId) {
          const userModel = await models.user.findByPk(req[objName].userId)
          user = {
            userId: userModel.id,
            admin: userModel.admin
          }
        }
        checkUserPermissions(adminOnly, user, req[objName][key])
      }
      next()
    }
  }
}
