
import express from 'express'
import api from './api'
import cors from 'cors'
import SlackBot from '../bots/slackbot'
import logger from './logging'

require('dotenv').config()

const app = express()
app.use(cors())
if (process.env.NODE_ENV === 'development') {
  app.set('json spaces', 2)
}

// api router
app.use('/api', api())

/**
 * If Slackbot is configured into use
 * it can be signaled to send messages by
 * doing http GET into localhost:PORT/slackbot
 */
app.use('/slackbot', (req, res) => {
  if (req.hostname === 'localhost' && req.ip === '::1') {
    try {
      SlackBot.sendSlackMessages()
      res.sendStatus(200)
    } catch (err) {
      logger.error(err)
      res.sendStatus(400)
    }
  }
})

module.exports = app
