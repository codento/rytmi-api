import { version } from '../package.json'
import { Router } from 'express'
import winston from 'winston'
import bodyParser from 'body-parser'
import { ValidationError } from 'sequelize'
import users from './users'
import profiles from './profiles'
import skills from './skills'
import profileSkills from './profileSkills'
import auth from './auth'
import utils from './utils'

require('dotenv').config()

const tsFormat = () => (new Date()).toLocaleTimeString()
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      silent: process.env.NODE_ENV === 'test'
    })
  ]
})

function validateErrorHandler (err, req, res, next) {
  if (err instanceof ValidationError) {
    let arr = err.errors.map((error) => error.message)

    res.status(400).json(utils.errorTemplate(400, arr))
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
    logger.info('GET request to', req.url, 'from', req.headers['x-forwarded-for'] || req.connection.remoteAddress)
    res.json({ version })
  })

  api.use('/users', users())
  api.use('/profiles', profiles())
  api.use('/skills', skills())
  api.use('/profileskills', profileSkills())
  api.use('/auth', auth())

  api.use(validateErrorHandler)
  api.use(errorHandler)

  return api
}
