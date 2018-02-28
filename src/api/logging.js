import winston from 'winston'
import expressWinston from 'express-winston'

const fs = require('fs')
const env = process.env.NODE_ENV || 'development'
const logDir = 'log'

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const tsFormat = () => (new Date()).toLocaleTimeString()

const logger = new (winston.Logger)({
  level: env === 'production' ? 'info' : 'debug',
  transports: [
    new (winston.transports.Console)({
      silent: env === 'test',
      colorize: true,
      timestamp: tsFormat
    }),
    new (winston.transports.File)({
      silent: env === 'test',
      filename: `${logDir}/log.log`,
      timestamp: tsFormat,
      maxsize: 100 * 1024,
      maxFiles: 2
    })
  ]
})

export default logger

export const httpLogger = expressWinston.logger({
  winstonInstance: logger,
  statusLevels: true
})