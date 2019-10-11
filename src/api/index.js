if (!global._babelPolyfill) {
  require('@babel/polyfill')
}
const services = require('../cv/tools/manageServiceAccountFiles')
const cron = require('node-cron')
const app = require('./app')
const logger = require('./logging').default

// Run a cleaning function to remove cv-files from google drive
if (process.env.NODE_ENV === 'production') {
  cron.schedule('0 1 * * *', () => {
    logger.info('Running google drive cleanup')
    services.deleteFiles()
  })
}

let server = app.listen(process.env.PORT, () => {
  logger.info(`Started on port ${server.address().port}`)
})
