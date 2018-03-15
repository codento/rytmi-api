import { Router } from 'express'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import utils from '../utils'
import UserService from '../../services/users'
import ProfileService from '../../services/profiles'
import logger from '../logging'

require('dotenv').config()

class NotAuthorizedError extends Error {}
class ServerError extends Error {}

const router = Router()

async function verify (idToken) {
  const userService = new UserService()
  const profileService = new ProfileService()
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: process.env.GOOGLE_CLIENT_ID
  })

  const ticketPayload = ticket.getPayload()
  if (ticketPayload.hd !== process.env.GOOGLE_ORG_DOMAIN) {
    logger.error('Unauthorized login attempt from', ticketPayload.hd, 'with following info:', ticketPayload.sub)
    throw new NotAuthorizedError('Domain not authorized')
  }

  const googleId = ticketPayload['sub']

  let user = await userService.getByGoogleId(googleId)
  if (!user) {
    try {
      user = await userService.create({
        googleId: googleId,
        firstName: ticketPayload.given_name,
        lastName: ticketPayload.family_name,
        active: true,
        admin: false
      })
    } catch (err) {
      logger.error('Trouble creating user', err.message)
      throw new ServerError('Could not create user')
    }
  }

  let profile = await profileService.getByUserId(user.id)
  if (!profile) {
    try {
      profile = await profileService.create({
        userId: user.id,
        firstName: ticketPayload.given_name,
        lastName: ticketPayload.family_name,
        email: ticketPayload.email,
        photoPath: ticketPayload.picture,
        active: true
      })
    } catch (err) {
      logger.error('Trouble creating profile', err.message)
      throw new ServerError('Could not create profile')
    }
  }

  const expires = Math.floor(new Date() / 1000) + parseInt(process.env.JWT_VALID_TIME)
  const payload = {
    googleId: user.googleId,
    userId: user.id,
    email: ticketPayload.email,
    exp: expires
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET)

  return {
    message: 'Welcome to Rytmi app',
    userId: user.id,
    profileId: profile.id,
    jwt: {
      token: token,
      expires: expires
    }
  }
}

export default () => {
  router.post('/', (req, res) => {
    const idToken = req.body.id_token
    if (idToken === 'undefined') {
      res.status(400).json(utils.errorTemplate(400, 'Missing client id'))
    }
    verify(idToken)
      .then((authInfo) => {
        res.json(authInfo)
      })
      .catch(err => {
        logger.debug('Catched error:', err.message)
        if (err instanceof NotAuthorizedError) {
          res.status(403).json(utils.errorTemplate(403, 'Not authorized'))
        } else if (err instanceof ServerError) {
          res.status(500).json(utils.errorTemplate(500, 'Something horrible happened on a server side.', err.message))
        } else {
          res.status(400).json(utils.errorTemplate(400, 'Authentication error', err.message))
        }
      })
  })

  return router
}
