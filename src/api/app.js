
import express from 'express'
import api from './api'
import cors from 'cors'
import SlackBot from '../bots/slackbot'

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
if (process.env.SLACK_ACCESS_TOKEN) {
  app.use('/slackbot', (req, res) => {
    if (req.hostname === 'localhost' && req.ip === '::1') {
      SlackBot.sendSlackMessages()
      res.sendStatus(200)
    }
  })
}

module.exports = app
