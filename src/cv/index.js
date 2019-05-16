import { Router } from 'express'
import bodyParser from 'body-parser'
import logger, { httpLogger } from '../api/logging'
import { version } from '../../package.json'
import service from './service'

export default () => {
  const cv = Router()

  cv.use(bodyParser.json())
  cv.use(httpLogger)

  cv.get('/', (req, res) => {
    res.json({ version })
  })

  cv.post('/', async (req, res, next) => {
    logger.debug('New POST request to /cv from', req.url)
    try {
      const { id } = await service.create()
      logger.debug('Created new copy with id', id)
      setTimeout(async () => {
        logger.debug('Populating CV with data...')
        await service.update(id, req.body)
        logger.debug('Exporting CV to PDF...')
        const filePath = await service.runExport(id)
        logger.debug('PDF downloaded to', filePath)
        res.download(filePath)
      }, 2000)
    } catch (e) {
      next(e)
    }
  })

  return cv
}
