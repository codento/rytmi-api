import { version } from '../../package.json'
import { Router } from 'express'

import bodyParser from 'body-parser'
import { ValidationError } from 'sequelize'
import users from './users'
import profiles from './profiles'
import skills from './skills'
import profileSkills from './profileSkills'
import auth from './auth'
import utils from './utils'
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
  res
    .status(500)
    .json(utils.errorTemplate(500, err))
}

export default () => {
  let api = Router()
  api.use(bodyParser.json())

  api.get('/', (req, res) => {
    logger.debug('New request for /api/ from', req.url)
    res.json({ version })
  })

  api.use(httpLogger)

  api.use('/users', users())
  api.use('/profiles', profiles())
  api.use('/skills', skills())
  api.use('/profileskills', profileSkills())
  api.use('/auth', auth())

  api.use(validateErrorHandler)
  api.use(errorHandler)

  return api
}
