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
    let id
    try {
      const data = await service.create()
      id = data.id
    } catch (err) {
      logger.debug('Error copying template:', err)
      return res.status(500).send({ error: 'GENERIC', description: 'There was an error when copying cv template' })
    }

    logger.debug('Created new copy with id', id)
    logger.debug('Populating CV with data...')
    try {
      await service.update(id, req.body)
    } catch (err) {
      logger.debug('Error updating template:', err)
      await service.deleteFile(id)
      return res.status(500).send({ error: 'GENERIC', description: 'There was an error updating cv template' })
    }

    if (!req.query.url) {
      logger.debug('Exporting CV to PDF...')
      try {
        const filePath = await service.runExport(id)
        logger.debug('PDF downloaded to', filePath)
        res.download(filePath, 'cv.pdf', (error) => {
          if (error) {
            console.error(error)
          } else {
            service.deleteFileOnLocalDrive(filePath)
          }
        })
      } catch (err) {
        logger.debug('Error while exporting:', err)
        await service.deleteFile(id)
        return res.status(500).send({ error: 'GENERIC', description: 'Cv export failed' })
      }
    } else {
      logger.debug('Creating Cv url...')
      try {
        const url = await service.getFileViewUrl(id)
        logger.debug('Google slide url: ', url)
        res.send(url)
      } catch (err) {
        logger.debug('Error while getting url:', err)
        await service.deleteFileOnGoogleDrive(id)
        return res.status(500).send({ error: 'GENERIC', description: 'Creating Cv url failed' })
      }
    }
  })

  return cv
}
