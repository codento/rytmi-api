
import express from 'express'
import api from './api'
import cv from '../cv'
import cors from 'cors'
require('dotenv').config()

const app = express()
app.use(cors())
if (process.env.NODE_ENV === 'development') {
  app.set('json spaces', 2)
}

// api router
app.use('/api', api())
app.use('/cv', cv())

module.exports = app
