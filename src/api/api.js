import { version } from '../../package.json'
import { Router } from 'express'
import jwt, { UnauthorizedError } from 'express-jwt'

import bodyParser from 'body-parser'
import { ValidationError } from 'sequelize'
import users from './users'
import profiles from './profiles'
import skills from './skills'
import profileSkills from './profileSkills'
import auth from './auth'
import utils from './utils'
import projects from './projects'
import profileProjects from './profileProjects'
import logger, { httpLogger } from './logging'

require('dotenv').config()

function validateErrorHandler (err, req, res, next) {
  if (err instanceof ValidationError) {
    let messages = err.errors.map((error) => error.message)

    res.status(400).json(utils.errorTemplate(400, 'Validation error', messages))
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

  api.use('/auth', auth())
  api.use(jwt({secret: process.env.JWT_SECRET}).unless({path: ['/auth']})) // TODO: Study where this should actually be placed. Now unless don't work, just the order matters.

  api.use('/profiles', profiles())
  api.use('/skills', skills())
  api.use('/profileskills', profileSkills())
  api.use('/users', users())
  api.use('/projects', projects())
  api.use('/profileProjects', profileProjects())

  api.use(validateErrorHandler)
  api.use(errorHandler)

  return api
}
