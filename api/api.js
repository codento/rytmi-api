import { version } from '../package.json'
import { Router } from 'express'
import winston from 'winston'
import bodyParser from 'body-parser'

import users from './users'
import profiles from './profiles'
import skills from './skills'
import profileSkills from './profileSkills'

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

  return api
}
