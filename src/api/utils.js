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
        let userId = req[objName][key]
        // fetch userId from profile
        if (key === 'profileId') {
          const profileModel = await models.profile.findByPk(req[objName].profileId)
          userId = profileModel.userId
        }
        if (!user) {
          const userModel = await models.user.findByPk(userId)
          user = {
            userId: userModel.id,
            admin: userModel.admin
          }
        }
        try {
          checkUserPermissions(adminOnly, user, userId)
        } catch (e) {
          next(e)
        }
      }
      next()
    }
  }
}
