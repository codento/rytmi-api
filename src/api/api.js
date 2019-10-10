import { version } from '../../package.json'
import { Router } from 'express'
import jwt, { UnauthorizedError } from 'express-jwt'

import bodyParser from 'body-parser'
import { ValidationError } from 'sequelize'
import CustomValidationError from '../validators/customValidationError'
import PermissionDeniedError from '../validators/permissionDeniedError'
import users from './users'
import profiles from './profiles'
import skills from './skills'
import profileSkills from './profileSkills'
import auth from './auth'
import utils from './utils'
import projects from './projects'
import profileProjects from './profileProjects'
import skillCategories from './skillCategories'
import skillGroups from './skillGroups'
import employeeRoles from './employeeRoles'
import employers from './employers'
import profileEmployers from './profileEmployers'
import projectSkills from './projectSkills'
import leaves from './leaves'
import absences from './absences'
import logger, { httpLogger } from './logging'
import swagger from './swagger'

require('dotenv').config()

function validateErrorHandler (err, req, res, next) {
  if (err instanceof ValidationError) {
    let messages = err.errors.map((error) => error.message)
    res.status(400).json(utils.errorTemplate(400, 'Validation error', messages))
  } else if (err instanceof CustomValidationError) {
    res.status(400).json(utils.errorTemplate(400, 'Validation error', [err.message]))
  } else if (err instanceof PermissionDeniedError) {
    res.status(403).json(utils.errorTemplate(403, 'Permission denied', [err.message]))
  } else {
    next(err)
  }
}

function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  if (err instanceof UnauthorizedError) {
    res
      .status(401)
      .json(
        utils.errorTemplate(401, 'Unauthorized error', err)
      )
  } else {
    res
      .status(500)
      .json(
        utils.errorTemplate(500, 'Server error', err.message)
      )
  }
}

export default () => {
  let api = Router()
  api.use(bodyParser.json())

  api.get('/', (req, res) => {
    logger.debug('New request for /api/ from', req.url)
    res.json({ version })
  })

  api.use(httpLogger)

  api.use('/swagger', swagger())

  api.use('/auth', auth())
  api.use(jwt({ secret: process.env.JWT_SECRET }).unless({ path: ['/auth'] })) // TODO: Study where this should actually be placed. Now unless don't work, just the order matters.

  api.use('/profiles', profiles())
  api.use('/skills', skills())
  api.use('/profileskills', profileSkills())
  api.use('/users', users())
  api.use('/projects', projects())
  api.use('/profileprojects', profileProjects())
  api.use('/skillcategories', skillCategories())
  api.use('/skillgroups', skillGroups())
  api.use('/employeeroles', employeeRoles())
  api.use('/employers', employers())
  api.use('/profileemployers', profileEmployers())
  api.use('/projectskills', projectSkills())
  api.use('/leaves', leaves())
  api.use('/absences', absences())

  api.use(validateErrorHandler)
  api.use(errorHandler)

  return api
}
